const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getAllProductsForAdmin,
  getSellerProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

// ======================================================
// Customer - Get Active Products
// ======================================================

router.get(
  "/",
  getProducts
);

// ======================================================
// Admin - Get All Products
// ======================================================

router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllProductsForAdmin
);

// ======================================================
// Seller - Get My Products
// IMPORTANT: Before /:id
// ======================================================

router.get(
  "/seller/my-products",
  protect,
  authorizeRoles("seller"),
  getSellerProducts
);

// ======================================================
// Get Single Product
// ======================================================

router.get(
  "/:id",
  getProductById
);

// ======================================================
// Create Product
// Seller / Admin
// ======================================================

router.post(
  "/",
  protect,
  authorizeRoles("seller", "admin"),
  upload.array("images", 5),
  createProduct
);

// ======================================================
// Admin - Activate / Deactivate
// ======================================================

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateProductStatus
);

// ======================================================
// Update Product
// Seller / Admin
// ======================================================

router.put(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  upload.array("images", 5),
  updateProduct
);

// ======================================================
// Delete Product
// Seller / Admin
// ======================================================

router.delete(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  deleteProduct
);

module.exports = router;