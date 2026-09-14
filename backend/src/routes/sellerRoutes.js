const express = require("express");

const {
  getSellerDashboard,
} = require("../controllers/sellerController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("seller"),
  getSellerDashboard
);

module.exports = router;