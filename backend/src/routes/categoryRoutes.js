const express = require("express");

const router = express.Router();

const {
  createCategory,
  getCategories,
  getAllCategoriesForAdmin,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Customer - get active categories
router.get("/", getCategories);

// Admin - get all categories
router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllCategoriesForAdmin
);

// Admin - create category
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCategory
);

// Admin - update category
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCategory
);

// Admin - activate/deactivate category
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateCategoryStatus
);

// Admin - delete category
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCategory
);

// Get single category
router.get("/:id", getCategoryById);

module.exports = router;