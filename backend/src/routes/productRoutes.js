const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorizeRoles("seller", "admin"),
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  deleteProduct
);

module.exports = router;