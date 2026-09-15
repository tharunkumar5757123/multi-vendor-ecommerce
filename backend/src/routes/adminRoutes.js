const express = require("express");

const {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

router.put(
  "/users/:id/status",
  protect,
  authorizeRoles("admin"),
  updateUserStatus
);

module.exports = router;