const stripe = require("../config/stripe");
const Order = require("../models/Order");

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "Webhook signature verification failed:",
      error.message
    );

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const orderId = session.metadata?.orderId;

        if (!orderId) {
          break;
        }

        const order = await Order.findById(orderId);

        if (!order) {
          break;
        }

        order.paymentStatus = "paid";

        await order.save();

        console.log(
          `Payment successful for order ${orderId}`
        );

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;

        const orderId = session.metadata?.orderId;

        if (!orderId) {
          break;
        }

        const order = await Order.findById(orderId);

        if (!order) {
          break;
        }

        if (order.paymentStatus !== "paid") {
          order.paymentStatus = "failed";

          await order.save();
        }

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
    }

    res.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Webhook processing error:",
      error.message
    );

    res.status(500).json({
      message: "Webhook processing failed",
    });
  }
};

module.exports = {
  handleStripeWebhook,
};