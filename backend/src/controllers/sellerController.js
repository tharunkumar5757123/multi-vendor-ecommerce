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
// =====================================================
// GET SELLER CUSTOMERS
// =====================================================
const getSellerCustomers = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "items.seller": req.user._id,
    })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    const customerMap = new Map();

    orders.forEach((order) => {
      if (!order.user) return;

      // Only items belonging to this seller
      const sellerItems = order.items.filter(
        (item) =>
          item.seller &&
          item.seller.toString() === req.user._id.toString()
      );

      if (sellerItems.length === 0) return;

      const customerId = order.user._id.toString();

      // Calculate only this seller's amount
      const sellerTotal = sellerItems.reduce(
        (total, item) => {
          return total + Number(item.subtotal || 0);
        },
        0
      );

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name: order.user.name || "Customer",
          email: order.user.email || "No email",
          phone: order.user.phone || "No phone",
          orders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
        });
      }

      const customer = customerMap.get(customerId);

      customer.orders += 1;
      customer.totalSpent += sellerTotal;

      if (
        new Date(order.createdAt) >
        new Date(customer.lastOrderDate)
      ) {
        customer.lastOrderDate = order.createdAt;
      }
    });

    const customers = Array.from(
      customerMap.values()
    ).map((customer) => ({
      ...customer,
      totalSpent: Number(
        customer.totalSpent.toFixed(2)
      ),
    }));

    return res.status(200).json({
      message: "Seller customers fetched successfully",
      customers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSellerDashboard,
};