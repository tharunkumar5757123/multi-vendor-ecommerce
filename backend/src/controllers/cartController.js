const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getEffectivePrice = (product) => {
  if (product.discountPrice && product.discountPrice > 0) {
    return product.discountPrice;
  }

  return product.price;
};

// GET CART
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    let totalAmount = 0;

    cart.items.forEach((item) => {
      if (item.product) {
        const price = getEffectivePrice(item.product);

        totalAmount += price * item.quantity;
      }
    });

    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};


// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
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
        message: "Product is not available",
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({
        message: "Product is out of stock",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items are available`,
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items are available`,
        });
      }

      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};


// UPDATE CART ITEM
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not found in cart",
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
        message: "Product is no longer available",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items are available`,
      });
    }

    cartItem.quantity = quantity;

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
      error: error.message,
    });
  }
};


// REMOVE ITEM
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product",
      error: error.message,
    });
  }
};


// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};


module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};