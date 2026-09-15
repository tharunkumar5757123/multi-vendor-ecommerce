const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Customer
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate({
      path: "products",
      select:
        "name brand price discountPrice images stock rating numReviews category seller isActive",
      populate: [
        {
          path: "category",
          select: "name",
        },
        {
          path: "seller",
          select: "name email",
        },
      ],
    });

    // Create an empty wishlist if user doesn't have one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist: wishlist.products || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Customer
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Don't allow inactive products
    if (!product.isActive) {
      return res.status(400).json({
        message: "This product is not available",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });
    } else {
      // Check if already exists
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId
      );

      if (alreadyExists) {
        return res.status(400).json({
          message: "Product already exists in wishlist",
        });
      }

      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate({
      path: "products",
      select:
        "name brand price discountPrice images stock rating numReviews category seller isActive",
    });

    res.status(201).json({
      message: "Product added to wishlist",
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Customer
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    const productExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({
        message: "Product is not in wishlist",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear current user's wishlist
// @route   DELETE /api/wishlist
// @access  Customer
const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(200).json({
        message: "Wishlist is already empty",
        wishlist: [],
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      message: "Wishlist cleared successfully",
      wishlist: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};