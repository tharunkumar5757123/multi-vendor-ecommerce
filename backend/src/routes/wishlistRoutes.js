const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("customer"),
  getWishlist
);

router.post(
  "/:productId",
  protect,
  authorizeRoles("customer"),
  addToWishlist
);

router.delete(
  "/:productId",
  protect,
  authorizeRoles("customer"),
  removeFromWishlist
);

router.delete(
  "/",
  protect,
  authorizeRoles("customer"),
  clearWishlist
);

module.exports = router;