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

module.exports = {
  getAdminDashboard,
};