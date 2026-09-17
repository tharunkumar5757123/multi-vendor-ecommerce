const express = require("express");

const {
  createSellerRequest,
  getAllSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
} = require("../controllers/sellerRequestController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


/*
=========================================================
CUSTOMER / PUBLIC
Submit seller request
=========================================================
*/

router.post("/", createSellerRequest);


/*
=========================================================
ADMIN
Get all seller requests
=========================================================
*/

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAllSellerRequests
);


/*
=========================================================
ADMIN
Approve seller request
=========================================================
*/

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("admin"),
  approveSellerRequest
);


/*
=========================================================
ADMIN
Reject seller request
=========================================================
*/

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectSellerRequest
);


module.exports = router;