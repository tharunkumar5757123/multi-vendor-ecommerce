const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getMyProfile,
  updateProfile,
  changePassword,
  getAdminData,
  getSellerData,
} = require("../controllers/userController");

const router = express.Router();

// Customer profile
router.get("/profile", protect, getMyProfile);

router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateProfile
);

// Change password
router.put(
  "/change-password",
  protect,
  changePassword
);

// Admin
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminData
);

// Seller
router.get(
  "/seller",
  protect,
  authorizeRoles("seller"),
  getSellerData
);

module.exports = router;
