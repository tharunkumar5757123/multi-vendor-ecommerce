
import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/admin/all");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Admin orders error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "confirmed":
        return "bg-indigo-100 text-indigo-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPaymentClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const orderId = order._id?.toLowerCase() || "";
    const customerName =
      order.user?.name?.toLowerCase() || "";
    const customerEmail =
      order.user?.email?.toLowerCase() || "";

    const matchesSearch =
      orderId.includes(searchText) ||
      customerName.includes(searchText) ||
      customerEmail.includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      order.orderStatus === statusFilter;

    const matchesPayment =
      paymentFilter === "all" ||
      order.paymentStatus === paymentFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPayment
    );
  });

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;

  const pendingOrders = orders.filter(
    (order) =>
      ["placed", "confirmed", "processing", "shipped"].includes(
        order.orderStatus
      )
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "cancelled"
  ).length;

  const totalRevenue = orders
    .filter(
      (order) =>
        order.paymentStatus === "paid" &&
        order.orderStatus !== "cancelled"
    )
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Order Management
          </h1>

          <p className="text-gray-600 mt-2">
            View and monitor all customer orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingOrders}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {deliveredOrders}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Cancelled
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {cancelledOrders}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Paid Revenue
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h2>
          </div>

        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>

              <input
                type="text"
                placeholder="Order ID, customer name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="placed">
                  Placed
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="shipped">
                  Shipped
                </option>

                <option value="delivered">
                  Delivered
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>

              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="all">
                  All Payments
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="failed">
                  Failed
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">

          <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Orders
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredOrders.length} of{" "}
              {totalOrders} orders
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center">

              <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>

              <p className="text-gray-500 mt-4">
                Loading orders...
              </p>

            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                No orders found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Order
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Items
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredOrders.map((order) => (

                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      {/* Order */}
                      <td className="px-5 py-4 min-w-[170px]">

                        <p className="font-medium text-gray-800">
                          #{order._id?.slice(-8)}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </p>

                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4 min-w-[190px]">

                        <p className="font-medium text-gray-800">
                          {order.user?.name ||
                            "Unknown"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.user?.email || "-"}
                        </p>

                      </td>

                      {/* Items */}
                      <td className="px-5 py-4 text-gray-700">
                        {order.items?.length || 0}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-medium text-gray-800">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">

                        <p className="text-sm capitalize text-gray-700">
                          {order.paymentMethod || "-"}
                        </p>

                        <span
                          className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getPaymentClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus ||
                            "pending"}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus ||
                            "unknown"}
                        </span>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >

          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Order Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  #{selectedOrder._id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>

            </div>

            <div className="p-6">

              {/* Customer */}
              <div className="mb-6">

                <h3 className="font-semibold text-gray-800 mb-3">
                  Customer Information
                </h3>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="font-medium">
                    {selectedOrder.user?.name ||
                      "Unknown"}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {selectedOrder.user?.email ||
                      "-"}
                  </p>

                  {selectedOrder.user?.phone && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedOrder.user.phone}
                    </p>
                  )}

                </div>

              </div>

              {/* Shipping Address */}
              <div className="mb-6">

                <h3 className="font-semibold text-gray-800 mb-3">
                  Shipping Address
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">

                  <p className="font-medium">
                    {selectedOrder.shippingAddress
                      ?.fullName || "-"}
                  </p>

                  <p className="mt-1">
                    {selectedOrder.shippingAddress
                      ?.phone || "-"}
                  </p>

                  <p className="mt-2">
                    {selectedOrder.shippingAddress
                      ?.address || "-"}
                  </p>

                  <p>
                    {selectedOrder.shippingAddress
                      ?.city || "-"}
                    ,{" "}
                    {selectedOrder.shippingAddress
                      ?.state || "-"}
                  </p>

                  <p>
                    Pincode:{" "}
                    {selectedOrder.shippingAddress
                      ?.pincode || "-"}
                  </p>

                </div>

              </div>

              {/* Products */}
              <div className="mb-6">

                <h3 className="font-semibold text-gray-800 mb-3">
                  Ordered Products
                </h3>

                <div className="space-y-3">

                  {selectedOrder.items?.map(
                    (item, index) => {

                      const image =
                        typeof item.image ===
                        "string"
                          ? item.image
                          : item.image?.url ||
                            item.product?.images?.[0]
                              ?.url ||
                            "";

                      return (
                        <div
                          key={
                            item.product?._id ||
                            index
                          }
                          className="flex gap-4 bg-gray-50 rounded-xl p-4"
                        >

                          {image ? (
                            <img
                              src={image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                              No Image
                            </div>
                          )}

                          <div className="flex-1">

                            <p className="font-medium text-gray-800">
                              {item.name ||
                                item.product?.name ||
                                "Product"}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                            <p className="text-sm text-gray-500">
                              Item Status:{" "}
                              <span className="capitalize">
                                {item.itemStatus ||
                                  "-"}
                              </span>
                            </p>

                          </div>

                          <div className="font-semibold text-gray-800">
                            ₹
                            {Number(
                              item.subtotal || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-5">

                <h3 className="font-semibold text-gray-800 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-2 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {Number(
                        selectedOrder.subtotal || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Shipping
                    </span>

                    <span>
                      ₹
                      {Number(
                        selectedOrder.shippingFee || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Tax
                    </span>

                    <span>
                      ₹
                      {Number(
                        selectedOrder.tax || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-lg font-bold">

                    <span>
                      Total
                    </span>

                    <span>
                      ₹
                      {Number(
                        selectedOrder.totalAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>

              </div>

              {/* Payment + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Payment Method
                  </p>

                  <p className="font-medium capitalize mt-1">
                    {selectedOrder.paymentMethod ||
                      "-"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Payment Status
                  </p>

                  <p className="font-medium capitalize mt-1">
                    {selectedOrder.paymentStatus ||
                      "-"}
                  </p>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminOrders;
