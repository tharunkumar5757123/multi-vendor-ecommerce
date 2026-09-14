const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCategory
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCategory
);

module.exports = router;