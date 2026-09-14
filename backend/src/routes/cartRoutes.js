const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("customer"),
  getCart
);

router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  addToCart
);

router.put(
  "/:productId",
  protect,
  authorizeRoles("customer"),
  updateCartItem
);

router.delete(
  "/:productId",
  protect,
  authorizeRoles("customer"),
  removeCartItem
);

router.delete(
  "/",
  protect,
  authorizeRoles("customer"),
  clearCart
);

module.exports = router;