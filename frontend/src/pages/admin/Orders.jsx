import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // Fetch All Orders
  // ======================================================

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/admin/all");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("ORDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ======================================================
  // Format Date
  // ======================================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // Status Classes
  // ======================================================

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-700";

      case "confirmed":
        return "bg-indigo-100 text-indigo-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ======================================================
  // Payment Status Classes
  // ======================================================

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "refunded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading orders...
        </p>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Order Management
          </h1>

          <p className="text-gray-600 mt-2">
            Manage all customer orders
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4">
                    Order ID
                  </th>

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Items
                  </th>

                  <th className="px-6 py-4">
                    Total
                  </th>

                  <th className="px-6 py-4">
                    Payment
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>

                {orders.length === 0 ? (

                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>

                ) : (

                  orders.map((order) => (

                    <tr
                      key={order._id}
                      className="border-t hover:bg-gray-50"
                    >

                      {/* Order ID */}
                      <td className="px-6 py-4">

                        <p className="font-semibold text-gray-800">
                          #{order._id.slice(-8)}
                        </p>

                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">

                        <p className="font-medium text-gray-800">
                          {order.user?.name ||
                            "Unknown"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.user?.email ||
                            ""}
                        </p>

                      </td>

                      {/* Items */}
                      <td className="px-6 py-4">
                        {order.items?.length || 0}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-semibold">
                        ₹{order.totalAmount}
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>

                        <p className="text-xs text-gray-500 mt-1">
                          {order.paymentMethod}
                        </p>

                      </td>

                      {/* Order Status */}
                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getOrderStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(
                          order.createdAt
                        )}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Orders;