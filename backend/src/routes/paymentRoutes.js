const express = require("express");

const {
  createCheckoutSession,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/create-checkout-session",
  protect,
  authorizeRoles("customer"),
  createCheckoutSession
);

module.exports = router;