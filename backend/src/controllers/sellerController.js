const Product = require("../models/Product");
const Order = require("../models/Order");

const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Total products
    const totalProducts = await Product.countDocuments({
      seller: sellerId,
    });

    // Find orders containing seller's products
    const orders = await Order.find({
      "items.seller": sellerId,
    });

    let totalOrders = orders.length;
    let pendingOrders = 0;
    let deliveredOrders = 0;
    let totalSales = 0;

    orders.forEach((order) => {
      let sellerOrderTotal = 0;

      order.items.forEach((item) => {
        if (
          item.seller.toString() === sellerId.toString()
        ) {
          sellerOrderTotal += item.subtotal;

          if (
            item.itemStatus === "delivered"
          ) {
            deliveredOrders++;
          } else if (
            item.itemStatus !== "cancelled"
          ) {
            pendingOrders++;
          }
        }
      });

      totalSales += sellerOrderTotal;
    });

    res.status(200).json({
      message: "Seller dashboard data fetched successfully",

      dashboard: {
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalSales,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch seller dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getSellerDashboard,
};