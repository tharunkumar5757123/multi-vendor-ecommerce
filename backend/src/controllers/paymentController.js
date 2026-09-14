const stripe = require("../config/stripe");
const Order = require("../models/Order");

const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Make sure this order belongs to the logged-in customer
    if (
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to pay for this order",
      });
    }

    // Don't allow payment for cancelled orders
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        message: "Cancelled order cannot be paid",
      });
    }

    // Don't create another payment for an already-paid order
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Order is already paid",
      });
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "inr",

        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },

        unit_amount: Math.round(item.price * 100),
      },

      quantity: item.quantity,
    }));

    // Add shipping as a line item if required
    if (order.shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",

          product_data: {
            name: "Shipping",
          },

          unit_amount: Math.round(
            order.shippingFee * 100
          ),
        },

        quantity: 1,
      });
    }

    // Add tax
    if (order.tax > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",

          product_data: {
            name: "Tax",
          },

          unit_amount: Math.round(
            order.tax * 100
          ),
        },

        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: lineItems,

      success_url:
        "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        "http://localhost:5173/payment-cancelled",

      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },

      customer_email: req.user.email,
    });

    res.status(200).json({
      message: "Checkout session created",
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

module.exports = {
  createCheckoutSession,
};