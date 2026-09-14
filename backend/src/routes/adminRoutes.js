const express = require("express");

const {
  getAdminDashboard,
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

module.exports = router;