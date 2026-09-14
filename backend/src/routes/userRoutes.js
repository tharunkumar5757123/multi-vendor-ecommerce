const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getMyProfile,
  getAdminData,
  getSellerData,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getMyProfile);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminData
);

router.get(
  "/seller",
  protect,
  authorizeRoles("seller"),
  getSellerData
);

module.exports = router;