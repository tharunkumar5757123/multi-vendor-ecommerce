const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getAdminDashboard = async (req, res) => {
  try {
    // Total customers
    const totalUsers = await User.countDocuments({
      role: "customer",
    });

    // Total sellers
    const totalSellers = await User.countDocuments({
      role: "seller",
    });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      orderStatus: {
        $in: ["placed", "confirmed", "processing", "shipped"],
      },
    });

    // Delivered orders
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    // Calculate revenue
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          orderStatus: {
            $ne: "cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Admin dashboard data fetched successfully",

      dashboard: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin dashboard",
      error: error.message,
    });
  }
};


// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Update user active status
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
};