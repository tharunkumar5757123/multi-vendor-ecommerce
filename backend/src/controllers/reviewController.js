const Review = require("../models/Review");
const Product = require("../models/Product");


// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        message: "This product is not available",
      });
    }

    // Check whether customer purchased and received the product
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      items: {
        $elemMatch: {
          product: productId,
          itemStatus: "delivered",
        },
      },
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message:
          "You can review this product only after purchasing and receiving it",
      });
    }

    // Check whether user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    await updateProductRating(productId);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name profileImage");

    res.status(201).json({
      message: "Review created successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// GET PRODUCT REVIEWS
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};


// UPDATE REVIEW
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update your own review",
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    await updateProductRating(review.product);

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name profileImage");

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update review",
      error: error.message,
    });
  }
};


// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (
      review.user.toString() !==
      req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this review",
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(reviewId);

    await updateProductRating(productId);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};


// UPDATE PRODUCT RATING
const updateProductRating = async (productId) => {
  const result = await Review.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });

    return;
  }

  await Product.findByIdAndUpdate(productId, {
    rating: Number(result[0].averageRating.toFixed(1)),
    numReviews: result[0].reviewCount,
  });
};


module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};