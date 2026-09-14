const express = require("express");

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Get reviews for a product
router.get(
  "/product/:productId",
  getProductReviews
);


// Create review
router.post(
  "/product/:productId",
  protect,
  authorizeRoles("customer"),
  createReview
);


// Update review
router.put(
  "/:reviewId",
  protect,
  authorizeRoles("customer"),
  updateReview
);


// Delete review
router.delete(
  "/:reviewId",
  protect,
  authorizeRoles("customer", "admin"),
  deleteReview
);


module.exports = router;