const SellerRequest = require("../models/SellerRequest");
const User = require("../models/User");

/*
=========================================================
CREATE SELLER REQUEST
POST /api/seller-requests
=========================================================
*/

const createSellerRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      businessName,
      businessCategory,
      reason,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !businessName ||
      !businessCategory ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    const existingPendingRequest = await SellerRequest.findOne({
      email: email.toLowerCase(),
      status: "pending",
    });

    if (existingPendingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending seller request",
      });
    }

    const request = await SellerRequest.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      businessName,
      businessCategory,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Seller request submitted successfully",
      request,
    });
  } catch (error) {
    console.error("CREATE SELLER REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit seller request",
    });
  }
};


/*
=========================================================
GET ALL SELLER REQUESTS
GET /api/seller-requests/admin
ADMIN ONLY
=========================================================
*/

const getAllSellerRequests = async (req, res) => {
  try {
    const requests = await SellerRequest.find()
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("GET SELLER REQUESTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seller requests",
    });
  }
};


/*
=========================================================
APPROVE SELLER REQUEST
PUT /api/seller-requests/:id/approve
ADMIN ONLY
=========================================================
*/

const approveSellerRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await SellerRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Seller request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    /*
    Find existing user using request email
    */

    const user = await User.findOne({
      email: request.email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No user account found with this email. Ask the applicant to register first.",
      });
    }

    /*
    Change user role to seller
    */

    user.role = "seller";

    await user.save();

    /*
    Update seller request
    */

    request.status = "approved";
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: "Seller request approved successfully",
      request,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("APPROVE SELLER REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve seller request",
    });
  }
};


/*
=========================================================
REJECT SELLER REQUEST
PUT /api/seller-requests/:id/reject
ADMIN ONLY
=========================================================
*/

const rejectSellerRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await SellerRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Seller request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    request.status = "rejected";
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: "Seller request rejected",
      request,
    });
  } catch (error) {
    console.error("REJECT SELLER REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject seller request",
    });
  }
};


module.exports = {
  createSellerRequest,
  getAllSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
};