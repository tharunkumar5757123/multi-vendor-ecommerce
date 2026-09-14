const express = require("express");

const {
  addAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Get all my addresses
router.get(
  "/",
  protect,
  authorizeRoles("customer"),
  getMyAddresses
);


// Get single address
router.get(
  "/:id",
  protect,
  authorizeRoles("customer"),
  getAddressById
);


// Add address
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  addAddress
);


// Update address
router.put(
  "/:id",
  protect,
  authorizeRoles("customer"),
  updateAddress
);


// Delete address
router.delete(
  "/:id",
  protect,
  authorizeRoles("customer"),
  deleteAddress
);


// Set default address
router.put(
  "/:id/default",
  protect,
  authorizeRoles("customer"),
  setDefaultAddress
);


module.exports = router;