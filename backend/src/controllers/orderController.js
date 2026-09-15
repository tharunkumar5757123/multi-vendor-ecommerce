const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Address = require("../models/Address");

// =====================================================
// CREATE ORDER
// =====================================================
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { addressId, paymentMethod } = req.body;

    if (!addressId) {
      return res.status(400).json({
        message: "Delivery address is required",
      });
    }

    if (!["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    session.startTransaction();

    // Get address
    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    }).session(session);

    if (!address) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Delivery address not found",
      });
    }

    // Get cart
    const cart = await Cart.findOne({
      user: req.user._id,
    })
      .populate("items.product")
      .session(session);

    if (!cart || !cart.items || cart.items.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const orderItems = [];
    let subtotal = 0;

    // ================================================
    // Validate products and calculate subtotal
    // ================================================
    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        await session.abortTransaction();

        return res.status(400).json({
          message: "One or more products are no longer available",
        });
      }

      if (!product.isActive) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `${product.name} is no longer available`,
        });
      }

      if (product.stock <= 0) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      if (cartItem.quantity > product.stock) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `Only ${product.stock} units of ${product.name} are available`,
        });
      }

      const price =
        product.discountPrice &&
        product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      const itemTotal = price * cartItem.quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        seller: product.seller,
        name: product.name,
        price,
        quantity: cartItem.quantity,
        image: product.images?.[0] || "",
        status: "placed",
      });
    }

    // ================================================
    // Shipping
    // Free shipping for orders >= ₹1000
    // ================================================
    const shippingPrice = subtotal >= 1000 ? 0 : 50;

    // ================================================
    // Tax - 5%
    // ================================================
    const tax = Number((subtotal * 0.05).toFixed(2));

    // ================================================
    // Final total
    // ================================================
    const totalAmount = Number(
      (subtotal + shippingPrice + tax).toFixed(2)
    );

    // ================================================
    // Address snapshot
    // ================================================
    const shippingAddress = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || "India",
    };

    // ================================================
    // Create order
    // ================================================
    const createdOrders = await Order.create(
      [
        {
          user: req.user._id,

          items: orderItems,

          shippingAddress,

          subtotal,

          shippingPrice,

          tax,

          totalAmount,

          paymentMethod,

          paymentStatus:
            paymentMethod === "cod" ? "pending" : "pending",

          orderStatus: "placed",

          paidAt: null,

          deliveredAt: null,
        },
      ],
      { session }
    );

    const order = createdOrders[0];

    // ================================================
    // Reduce product stock
    // ================================================
    for (const cartItem of cart.items) {
      const product = cartItem.product;

      await Product.findByIdAndUpdate(
        product._id,
        {
          $inc: {
            stock: -cartItem.quantity,
          },
        },
        { session }
      );
    }

    // ================================================
    // Clear cart
    // ================================================
    cart.items = [];

    await cart.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Populate response
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product", "name brand images")
      .populate("items.seller", "name email");

    return res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (transactionError) {
      console.error(
        "Transaction rollback error:",
        transactionError
      );
    }

    next(error);
  } finally {
    session.endSession();
  }
};

// =====================================================
// GET MY ORDERS - CUSTOMER
// =====================================================
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product", "name brand images")
      .populate("items.seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET SINGLE ORDER
// =====================================================
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name brand images")
      .populate("items.seller", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Customer can only see their own order
    if (
      req.user.role === "customer" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this order",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// CANCEL ORDER - CUSTOMER
// =====================================================
const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Cannot cancel already shipped/delivered/cancelled
    if (
      ["shipped", "delivered", "cancelled"].includes(
        order.orderStatus
      )
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message: `Order cannot be cancelled because it is already ${order.orderStatus}`,
      });
    }

    // Restore product stock
    for (const item of order.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          },
          { session }
        );
      }
    }

    order.orderStatus = "cancelled";

    // Online payment is not automatically refunded here.
    // Refund handling can be added separately through Stripe.
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "cancelled";
    }

    await order.save({ session });

    await session.commitTransaction();

    const updatedOrder = await Order.findById(order._id)
      .populate("items.product", "name brand images")
      .populate("items.seller", "name email");

    res.status(200).json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (transactionError) {
      console.error(
        "Transaction rollback error:",
        transactionError
      );
    }

    next(error);
  } finally {
    session.endSession();
  }
};

// =====================================================
// GET SELLER ORDERS
// =====================================================
const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "items.seller": req.user._id,
    })
      .populate("items.product", "name brand images")
      .populate("items.seller", "name email")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Only return seller's own items
    const sellerOrders = orders.map((order) => {
      const orderObject = order.toObject();

      orderObject.items = orderObject.items.filter(
        (item) =>
          item.seller &&
          item.seller._id.toString() ===
            req.user._id.toString()
      );

      return orderObject;
    });

    res.status(200).json({
      message: "Seller orders fetched successfully",
      orders: sellerOrders,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE ORDER STATUS - SELLER
// =====================================================
const updateOrderStatusBySeller = async (
  req,
  res,
  next
) => {
  try {
    const { orderId } = req.params;
    const { productId, status } = req.body;

    const allowedStatuses = [
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const item = order.items.find(
      (orderItem) =>
        orderItem.product &&
        orderItem.product.toString() === productId &&
        orderItem.seller &&
        orderItem.seller.toString() ===
          req.user._id.toString()
    );

    if (!item) {
      return res.status(403).json({
        message:
          "You are not authorized to update this order item",
      });
    }

    // Status progression
    const statusOrder = [
      "placed",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];

    if (
      status !== "cancelled" &&
      statusOrder.indexOf(status) <
        statusOrder.indexOf(item.status)
    ) {
      return res.status(400).json({
        message: "Order status cannot move backwards",
      });
    }

    item.status = status;

    // If seller cancels their item, restore stock
    if (status === "cancelled") {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    // ================================================
    // Calculate overall order status
    // ================================================
    const itemStatuses = order.items.map(
      (orderItem) => orderItem.status
    );

    if (
      itemStatuses.every(
        (itemStatus) => itemStatus === "delivered"
      )
    ) {
      order.orderStatus = "delivered";
      order.deliveredAt = new Date();
    } else if (
      itemStatuses.some(
        (itemStatus) => itemStatus === "shipped"
      )
    ) {
      order.orderStatus = "shipped";
    } else if (
      itemStatuses.some(
        (itemStatus) => itemStatus === "processing"
      )
    ) {
      order.orderStatus = "processing";
    } else if (
      itemStatuses.some(
        (itemStatus) => itemStatus === "confirmed"
      )
    ) {
      order.orderStatus = "confirmed";
    } else if (
      itemStatuses.every(
        (itemStatus) => itemStatus === "cancelled"
      )
    ) {
      order.orderStatus = "cancelled";
    } else {
      order.orderStatus = "placed";
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("items.product", "name brand images")
      .populate("items.seller", "name email")
      .populate("user", "name email");

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name brand images")
      .populate("items.seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatusBySeller,
  getAllOrders,
};