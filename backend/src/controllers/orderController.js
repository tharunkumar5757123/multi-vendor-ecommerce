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

    // =================================================
    // GET ADDRESS
    // =================================================
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

    // =================================================
    // GET CART
    // =================================================
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

    // =================================================
    // VALIDATE PRODUCTS + CALCULATE SUBTOTAL
    // =================================================
    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        await session.abortTransaction();

        return res.status(400).json({
          message:
            "One or more products are no longer available",
        });
      }

      // Product active check
      if (!product.isActive) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `${product.name} is no longer available`,
        });
      }

      // Stock check
      if (product.stock <= 0) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      // Quantity vs stock
      if (cartItem.quantity > product.stock) {
        await session.abortTransaction();

        return res.status(400).json({
          message: `Only ${product.stock} units of ${product.name} are available`,
        });
      }

      // =================================================
      // EFFECTIVE PRICE
      // =================================================
      const price =
        product.discountPrice &&
        product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      // =================================================
      // ITEM SUBTOTAL
      // =================================================
      const itemSubtotal = Number(
        (price * cartItem.quantity).toFixed(2)
      );

      subtotal += itemSubtotal;

      // =================================================
      // ORDER ITEM
      // IMPORTANT:
      // Order schema uses itemStatus
      // =================================================
      orderItems.push({
        product: product._id,
        seller: product.seller,
        name: product.name,
        price,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,

        image:
          product.images?.[0]?.url ||
          product.images?.[0] ||
          "",

        itemStatus: "placed",
      });
    }

    // =================================================
    // ROUND SUBTOTAL
    // =================================================
    subtotal = Number(subtotal.toFixed(2));

    // =================================================
    // SHIPPING
    // Free shipping >= ₹1000
    // IMPORTANT:
    // Order schema uses shippingFee
    // =================================================
    const shippingFee =
      subtotal >= 1000 ? 0 : 50;

    // =================================================
    // TAX - 5%
    // =================================================
    const tax = Number(
      (subtotal * 0.05).toFixed(2)
    );

    // =================================================
    // FINAL TOTAL
    // =================================================
    const totalAmount = Number(
      (
        subtotal +
        shippingFee +
        tax
      ).toFixed(2)
    );

    // =================================================
    // ADDRESS SNAPSHOT
    // =================================================
    const shippingAddress = {
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    };

    // =================================================
    // CREATE ORDER
    // =================================================
    const createdOrders = await Order.create(
      [
        {
          user: req.user._id,

          items: orderItems,

          shippingAddress,

          subtotal,

          shippingFee,

          tax,

          totalAmount,

          paymentMethod,

          paymentStatus: "pending",

          orderStatus: "placed",
        },
      ],
      {
        session,
      }
    );

    const order = createdOrders[0];

    // =================================================
    // REDUCE PRODUCT STOCK
    // =================================================
    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product._id,
        {
          $inc: {
            stock: -cartItem.quantity,
          },
        },
        {
          session,
        }
      );
    }

    // =================================================
    // CLEAR CART
    // =================================================
    cart.items = [];

    await cart.save({
      session,
    });

    // =================================================
    // COMMIT TRANSACTION
    // =================================================
    await session.commitTransaction();

    // =================================================
    // POPULATE ORDER
    // =================================================
    const populatedOrder = await Order.findById(
      order._id
    )
      .populate(
        "items.product",
        "name brand images"
      )
      .populate(
        "items.seller",
        "name email"
      );

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
      .populate(
        "items.product",
        "name brand images"
      )
      .populate(
        "items.seller",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

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
    const order = await Order.findById(
      req.params.id
    )
      .populate(
        "items.product",
        "name brand images"
      )
      .populate(
        "items.seller",
        "name email"
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Customer can only see their own order
    if (
      req.user.role === "customer" &&
      order.user.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to view this order",
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

    // =================================================
    // FIND CUSTOMER ORDER
    // =================================================
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

    // =================================================
    // CHECK STATUS
    // =================================================
    const cancellableStatuses = [
      "placed",
      "confirmed",
      "processing",
    ];

    if (
      !cancellableStatuses.includes(
        order.orderStatus
      )
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message: `Order cannot be cancelled because it is already ${order.orderStatus}`,
      });
    }

    // =================================================
    // RESTORE STOCK
    // =================================================
    for (const item of order.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          },
          {
            session,
          }
        );
      }
    }

    // =================================================
    // UPDATE ORDER STATUS
    // IMPORTANT:
    // Use orderStatus = cancelled
    // NOT paymentStatus = cancelled
    // =================================================
    order.orderStatus = "cancelled";

    // =================================================
    // UPDATE ITEM STATUS
    // IMPORTANT:
    // Schema uses itemStatus
    // =================================================
    order.items.forEach((item) => {
      item.itemStatus = "cancelled";
    });

    // =================================================
    // PAYMENT STATUS
    // DO NOT SET "cancelled"
    //
    // Valid values:
    // pending
    // paid
    // failed
    // refunded
    //
    // For COD:
    // pending remains pending
    //
    // For paid online:
    // paid remains paid until
    // Stripe refund is actually processed.
    // =================================================

    await order.save({
      session,
    });

    // =================================================
    // COMMIT
    // =================================================
    await session.commitTransaction();

    // =================================================
    // GET UPDATED ORDER
    // =================================================
    const updatedOrder = await Order.findById(
      order._id
    )
      .populate(
        "items.product",
        "name brand images"
      )
      .populate(
        "items.seller",
        "name email"
      );

    return res.status(200).json({
      success: true,
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
      .populate(
        "items.product",
        "name brand images"
      )
      .populate(
        "items.seller",
        "name email"
      )
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    // Only seller's own items
    const sellerOrders = orders.map(
      (order) => {
        const orderObject =
          order.toObject();

        orderObject.items =
          orderObject.items.filter(
            (item) =>
              item.seller &&
              item.seller._id.toString() ===
                req.user._id.toString()
          );

        return orderObject;
      }
    );

    res.status(200).json({
      message:
        "Seller orders fetched successfully",
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

    const order = await Order.findById(
      orderId
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // =================================================
    // FIND SELLER ITEM
    // IMPORTANT:
    // Use itemStatus, NOT item.status
    // =================================================
    const item = order.items.find(
      (orderItem) =>
        orderItem.product &&
        orderItem.product.toString() ===
          productId &&
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

    // =================================================
    // STATUS PROGRESSION
    // =================================================
    const statusOrder = [
      "placed",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];

    const currentStatus =
      item.itemStatus;

    if (
      status !== "cancelled" &&
      statusOrder.indexOf(status) <
        statusOrder.indexOf(currentStatus)
    ) {
      return res.status(400).json({
        message:
          "Order status cannot move backwards",
      });
    }

    // =================================================
    // PREVENT DUPLICATE CANCELLATION
    // =================================================
    if (
      status === "cancelled" &&
      currentStatus === "cancelled"
    ) {
      return res.status(400).json({
        message:
          "This order item is already cancelled",
      });
    }

    // =================================================
    // PREVENT UPDATE AFTER CANCEL
    // =================================================
    if (
      currentStatus === "cancelled" &&
      status !== "cancelled"
    ) {
      return res.status(400).json({
        message:
          "A cancelled order item cannot be updated",
      });
    }

    // =================================================
    // RESTORE STOCK WHEN SELLER CANCELS
    // =================================================
    if (
      status === "cancelled" &&
      currentStatus !== "cancelled"
    ) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        }
      );
    }

    // =================================================
    // UPDATE ITEM STATUS
    // IMPORTANT:
    // Schema field is itemStatus
    // =================================================
    item.itemStatus = status;

    // =================================================
    // CALCULATE OVERALL ORDER STATUS
    // =================================================
    const itemStatuses =
      order.items.map(
        (orderItem) =>
          orderItem.itemStatus
      );

    // All cancelled
    if (
      itemStatuses.every(
        (itemStatus) =>
          itemStatus === "cancelled"
      )
    ) {
      order.orderStatus = "cancelled";
    }

    // All completed items are delivered/cancelled
    else if (
      itemStatuses.every(
        (itemStatus) =>
          itemStatus === "delivered" ||
          itemStatus === "cancelled"
      ) &&
      itemStatuses.some(
        (itemStatus) =>
          itemStatus === "delivered"
      )
    ) {
      order.orderStatus = "delivered";
    }

    // At least one shipped
    else if (
      itemStatuses.some(
        (itemStatus) =>
          itemStatus === "shipped"
      )
    ) {
      order.orderStatus = "shipped";
    }

    // At least one processing
    else if (
      itemStatuses.some(
        (itemStatus) =>
          itemStatus === "processing"
      )
    ) {
      order.orderStatus = "processing";
    }

    // At least one confirmed
    else if (
      itemStatuses.some(
        (itemStatus) =>
          itemStatus === "confirmed"
      )
    ) {
      order.orderStatus = "confirmed";
    }

    // Otherwise placed
    else {
      order.orderStatus = "placed";
    }

    // =================================================
    // SAVE
    // =================================================
    await order.save();

    // =================================================
    // RETURN UPDATED ORDER
    // =================================================
    const updatedOrder = await Order.findById(
      order._id
    )
      .populate(
        "items.product",
        "name brand images"
      )
      .populate(
        "items.seller",
        "name email"
      )
      .populate(
        "user",
        "name email"
      );

    return res.status(200).json({
      message:
        "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================
const getAllOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .populate(
        "items.product",
        "name brand images"
      )
      .populate(
        "items.seller",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message:
        "All orders fetched successfully",
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