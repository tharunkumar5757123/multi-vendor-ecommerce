const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getAllProductsForAdmin,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");


// Customer - Get active products
router.get("/", getProducts);


// Admin - Get all products
router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllProductsForAdmin
);


// Get single product
router.get("/:id", getProductById);


// Create product
router.post(
  "/",
  protect,
  authorizeRoles("seller", "admin"),
  upload.array("images", 5),
  createProduct
);


// Admin - Activate / Deactivate
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateProductStatus
);


// Update product
router.put(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  upload.array("images", 5),
  updateProduct
);


// Delete product
router.delete(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  deleteProduct
);


module.exports = router;