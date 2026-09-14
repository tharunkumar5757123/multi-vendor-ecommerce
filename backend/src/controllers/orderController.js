const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Address = require("../models/Address");


// CREATE ORDER
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      addressId,
      paymentMethod = "cod",
    } = req.body;

    if (!addressId) {
      return res.status(400).json({
        message: "Address ID is required",
      });
    }

    if (!["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    let createdOrder;

    await session.withTransaction(async () => {
      // Find address belonging to logged-in customer
      const address = await Address.findOne({
        _id: addressId,
        user: req.user._id,
      }).session(session);

      if (!address) {
        throw new Error(
          "Address not found or does not belong to you"
        );
      }

      // Get customer's cart
      const cart = await Cart.findOne({
        user: req.user._id,
      }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      const orderItems = [];
      let subtotal = 0;

      // Check every cart item
      for (const cartItem of cart.items) {
        const product = await Product.findById(
          cartItem.product
        ).session(session);

        if (!product) {
          throw new Error(
            "One of the products in your cart no longer exists"
          );
        }

        if (!product.isActive) {
          throw new Error(
            `${product.name} is currently unavailable`
          );
        }

        if (product.stock < cartItem.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}`
          );
        }

        // Use discount price if available
        const price =
          product.discountPrice > 0
            ? product.discountPrice
            : product.price;

        const itemSubtotal =
          price * cartItem.quantity;

        subtotal += itemSubtotal;

        orderItems.push({
          product: product._id,
          seller: product.seller,
          name: product.name,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "",
          price,
          quantity: cartItem.quantity,
          subtotal: itemSubtotal,
          itemStatus: "placed",
        });

        // Reduce stock
        product.stock -= cartItem.quantity;

        await product.save({ session });
      }

      // Shipping fee
      const shippingFee =
        subtotal >= 1000 ? 0 : 50;

      // 5% tax
      const tax = Math.round(subtotal * 0.05);

      const totalAmount =
        subtotal +
        shippingFee +
        tax;

      // Copy address into order
      const shippingAddress = {
        fullName: address.fullName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      };

      const orders = await Order.create(
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

      createdOrder = orders[0];

      // Clear cart
      cart.items = [];

      await cart.save({ session });
    });

    // Populate after transaction
    await createdOrder.populate([
      {
        path: "items.product",
        select: "name images price discountPrice",
      },
      {
        path: "items.seller",
        select: "name email",
      },
    ]);

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create order",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};


// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate("items.product", "name images brand")
      .populate("items.seller", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Customer can only see own order
    if (
      req.user.role === "customer" &&
      order.user.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to view this order",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};


// CANCEL ORDER
const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let cancelledOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(
        req.params.id
      ).session(session);

      if (!order) {
        throw new Error("Order not found");
      }

      if (
        order.user.toString() !==
        req.user._id.toString()
      ) {
        throw new Error(
          "You are not allowed to cancel this order"
        );
      }

      if (
        ["shipped", "delivered", "cancelled"].includes(
          order.orderStatus
        )
      ) {
        throw new Error(
          "This order cannot be cancelled"
        );
      }

      // Return stock
      for (const item of order.items) {
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

      order.orderStatus = "cancelled";

      await order.save({ session });

      cancelledOrder = order;
    });

    res.status(200).json({
      message: "Order cancelled successfully",
      order: cancelledOrder,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// GET SELLER ORDERS
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.seller": req.user._id,
    })
      .populate("user", "name email phone")
      .populate("items.product", "name images brand")
      .populate("items.seller", "name email")
      .sort({ createdAt: -1 });

    const sellerOrders = orders.map((order) => {
      const sellerItems = order.items.filter(
        (item) =>
          item.seller &&
          item.seller._id.toString() ===
            req.user._id.toString()
      );

      const sellerSubtotal = sellerItems.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      return {
        orderId: order._id,
        customer: order.user,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        items: sellerItems,
        sellerSubtotal,
      };
    });

    res.status(200).json({
      message: "Seller orders fetched successfully",
      orders: sellerOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch seller orders",
      error: error.message,
    });
  }
};


// UPDATE ORDER STATUS BY SELLER
const updateOrderStatusBySeller = async (req, res) => {
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

    if (!productId || !status) {
      return res.status(400).json({
        message: "Product ID and status are required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order item status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const orderItem = order.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.seller.toString() ===
          req.user._id.toString()
    );

    if (!orderItem) {
      return res.status(403).json({
        message:
          "This product does not belong to you in this order",
      });
    }

    orderItem.itemStatus = status;

    // -----------------------------------
    // Calculate overall order status
    // -----------------------------------

    const statuses = order.items.map(
      (item) => item.itemStatus
    );

    if (statuses.every((status) => status === "delivered")) {
      order.orderStatus = "delivered";
    } else if (
      statuses.every((status) => status === "cancelled")
    ) {
      order.orderStatus = "cancelled";
    } else if (
      statuses.some((status) => status === "shipped")
    ) {
      order.orderStatus = "shipped";
    } else if (
      statuses.some((status) => status === "processing")
    ) {
      order.orderStatus = "processing";
    } else if (
      statuses.some((status) => status === "confirmed")
    ) {
      order.orderStatus = "confirmed";
    } else {
      order.orderStatus = "placed";
    }

    await order.save();

    res.status(200).json({
      message: "Order item status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order item status",
      error: error.message,
    });
  }
};


// GET ALL ORDERS - ADMIN
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product", "name images brand")
      .populate("items.seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatusBySeller,
  getAllOrders,
};