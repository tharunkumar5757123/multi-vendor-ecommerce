const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateOrderStatusBySeller,
  getAllOrders,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================
// CUSTOMER
// =====================================

router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createOrder
);

router.get(
  "/my-orders",
  protect,
  authorizeRoles("customer"),
  getMyOrders
);

router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("customer"),
  cancelOrder
);


// =====================================
// SELLER
// =====================================

router.get(
  "/seller/my-orders",
  protect,
  authorizeRoles("seller"),
  getSellerOrders
);

router.put(
  "/seller/:orderId/status",
  protect,
  authorizeRoles("seller"),
  updateOrderStatusBySeller
);


// =====================================
// ADMIN
// =====================================

router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);


// =====================================
// SINGLE ORDER
// Keep dynamic route LAST
// =====================================

router.get(
  "/:id",
  protect,
  getOrderById
);


module.exports = router;