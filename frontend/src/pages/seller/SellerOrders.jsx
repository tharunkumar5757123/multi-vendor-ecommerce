
import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function SellerOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/seller/my-orders"
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("SELLER ORDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load seller orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getNextStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "placed":
        return ["confirmed", "cancelled"];

      case "confirmed":
        return ["processing", "cancelled"];

      case "processing":
        return ["shipped", "cancelled"];

      case "shipped":
        return ["delivered"];

      default:
        return [];
    }
  };

  const handleStatusUpdate = async (
    orderId,
    productId,
    status
  ) => {
    try {
      setUpdating(`${orderId}-${productId}`);

      await api.put(
        `/orders/seller/${orderId}/status`,
        {
          productId,
          status,
        }
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating("");
    }
  };

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

  const getStatusClass = (status) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Seller Orders
          </h1>

          <p className="text-gray-600 mt-2">
            Manage orders containing your products
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Total Orders:{" "}
            <span className="font-semibold text-gray-800">
              {orders.length}
            </span>
          </p>
        </div>

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No orders found
            </h2>

            <p className="text-gray-500 mt-2">
              Orders containing your products will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-5 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-semibold text-gray-800">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Order Date
                      </p>

                      <p className="font-medium text-gray-800">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Seller Total
                      </p>

                      <p className="font-bold text-green-600">
                        ₹
                        {Number(
                          order.sellerSubtotal || 0
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment
                      </p>

                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : order.paymentStatus ===
                              "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Products */}
                <div className="p-6">

                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Your Products
                  </h2>

                  <div className="space-y-4">

                    {order.items?.map((item) => {
                      const nextStatuses =
                        getNextStatuses(
                          item.itemStatus
                        );

                      const updateKey = `${order._id}-${item.product?._id}`;

                      return (
                        <div
                          key={
                            item.product?._id ||
                            item._id
                          }
                          className="border rounded-lg p-4"
                        >
                          <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">

                            {/* Product */}
                            <div className="flex items-center gap-4">

                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                  No Image
                                </div>
                              )}

                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {item.name}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                  Quantity:{" "}
                                  {item.quantity}
                                </p>

                                <p className="text-sm text-gray-500">
                                  Price: ₹
                                  {Number(
                                    item.price || 0
                                  ).toFixed(2)}
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                  Subtotal: ₹
                                  {Number(
                                    item.subtotal || 0
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Status + Actions */}
                            <div className="lg:text-right">

                              <p className="text-sm text-gray-500 mb-2">
                                Product Status
                              </p>

                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                  item.itemStatus
                                )}`}
                              >
                                {item.itemStatus}
                              </span>

                              {nextStatuses.length >
                                0 && (
                                <div className="flex flex-wrap gap-2 mt-3 lg:justify-end">

                                  {nextStatuses.map(
                                    (status) => (
                                      <button
                                        key={status}
                                        onClick={() =>
                                          handleStatusUpdate(
                                            order._id,
                                            item.product
                                              ?._id,
                                            status
                                          )
                                        }
                                        disabled={
                                          updating ===
                                          updateKey
                                        }
                                        className={`px-3 py-2 rounded-lg text-sm text-white ${
                                          status ===
                                          "cancelled"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-blue-600 hover:bg-blue-700"
                                        } disabled:bg-gray-400`}
                                      >
                                        {updating ===
                                        updateKey
                                          ? "Updating..."
                                          : status
                                              .charAt(
                                                0
                                              )
                                              .toUpperCase() +
                                            status.slice(
                                              1
                                            )}
                                      </button>
                                    )
                                  )}

                                </div>
                              )}

                            </div>

                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t px-6 py-5">
                  <h2 className="font-semibold text-gray-800 mb-2">
                    Shipping Address
                  </h2>

                  <p className="text-gray-600">
                    {order.shippingAddress?.fullName}
                  </p>

                  <p className="text-gray-600">
                    {order.shippingAddress?.phone}
                  </p>

                  <p className="text-gray-600">
                    {order.shippingAddress?.address},{" "}
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state} -{" "}
                    {order.shippingAddress?.pincode}
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default SellerOrders;
