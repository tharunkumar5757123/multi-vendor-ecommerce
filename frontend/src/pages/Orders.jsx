
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import api from "../services/api";

function Orders() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const isCustomer =
    isAuthenticated && user?.role === "customer";

  // ---------------------------------------
  // Fetch Customer Orders
  // ---------------------------------------
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      const orderData =
        response.data.orders ||
        response.data ||
        [];

      setOrders(
        Array.isArray(orderData)
          ? orderData
          : []
      );
    } catch (error) {
      console.error(
        "Orders fetch error:",
        error
      );

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Authentication Check
  // ---------------------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isCustomer) {
      navigate("/unauthorized");
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user?.role]);

  // ---------------------------------------
  // Filter Orders
  // ---------------------------------------
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.orderStatus ===
            statusFilter
        );

  // ---------------------------------------
  // Get Order ID
  // ---------------------------------------
  const getOrderId = (order) => {
    return (
      order?._id ||
      order?.id ||
      order?.orderId
    );
  };

  // ---------------------------------------
  // Get Display Order Number
  // ---------------------------------------
  const getOrderNumber = (order) => {
    if (order?.orderNumber) {
      return order.orderNumber;
    }

    if (
      order?.orderId &&
      typeof order.orderId === "string"
    ) {
      return order.orderId;
    }

    if (order?._id) {
      return order._id
        .slice(-8)
        .toUpperCase();
    }

    return "N/A";
  };

  // ---------------------------------------
  // Format Date
  // ---------------------------------------
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ---------------------------------------
  // Format Currency
  // ---------------------------------------
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );
  };

  // ---------------------------------------
  // Status Badge
  // ---------------------------------------
  const getStatusClasses = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "confirmed":
        return "bg-indigo-100 text-indigo-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "placed":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ---------------------------------------
  // Payment Badge
  // ---------------------------------------
  const getPaymentClasses = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ---------------------------------------
  // Count Items
  // ---------------------------------------
  const getItemCount = (order) => {
    return (
      order?.items?.reduce(
        (total, item) =>
          total +
          Number(item?.quantity || 0),
        0
      ) || 0
    );
  };

  // ---------------------------------------
  // Get Product Image
  // ---------------------------------------
  const getProductImage = (product) => {
    const image = product?.images?.[0];

    if (typeof image === "string") {
      return image;
    }

    return (
      image?.url ||
      "https://via.placeholder.com/100x100?text=No+Image"
    );
  };

  // ---------------------------------------
  // Get Item Price
  // ---------------------------------------
  const getItemPrice = (item) => {
    if (
      item?.price !== undefined &&
      item?.price !== null
    ) {
      return Number(item.price);
    }

    if (
      item?.discountPrice !== undefined &&
      item?.discountPrice !== null
    ) {
      return Number(item.discountPrice);
    }

    return Number(
      item?.product?.discountPrice ||
        item?.product?.price ||
        0
    );
  };

  // ---------------------------------------
  // Loading
  // ---------------------------------------
  if (
    loading ||
    !isAuthenticated ||
    !isCustomer
  ) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader text="Loading your orders..." />
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <section className="bg-gray-900 px-4 py-10 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-sm font-medium text-indigo-300">
              MY ACCOUNT
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-gray-300">
              Track and manage your purchases.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          {/* ================================= */}
          {/* ERROR */}
          {/* ================================= */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="font-medium text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchOrders}
                className="mt-3 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ================================= */}
          {/* ORDER HISTORY / FILTER */}
          {/* ================================= */}
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order History
                </h2>

                <p className="text-sm text-gray-500">
                  {orders.length} total order
                  {orders.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={fetchOrders}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Refresh
                </button>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">
                    All Orders
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
            </div>
          </div>

          {/* ================================= */}
          {/* EMPTY ORDERS */}
          {/* ================================= */}
          {orders.length === 0 &&
            !error && (
              <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-5 text-6xl">
                  📦
                </div>

                <h2 className="mb-3 text-2xl font-bold text-gray-900">
                  No Orders Yet
                </h2>

                <p className="mb-7 text-gray-500">
                  You haven't placed any
                  orders yet.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/products")
                  }
                  className="rounded-lg bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Start Shopping
                </button>
              </div>
            )}

          {/* ================================= */}
          {/* NO FILTER RESULTS */}
          {/* ================================= */}
          {orders.length > 0 &&
            filteredOrders.length === 0 && (
              <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
                <div className="mb-3 text-4xl">
                  🔎
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  No Matching Orders
                </h3>

                <p className="text-gray-500">
                  Try selecting another order
                  status.
                </p>
              </div>
            )}

          {/* ================================= */}
          {/* ORDERS */}
          {/* ================================= */}
          {filteredOrders.length > 0 && (
            <div className="space-y-5">
              {filteredOrders.map(
                (order) => {
                  const orderId =
                    getOrderId(order);

                  if (!orderId) {
                    return null;
                  }

                  return (
                    <div
                      key={orderId}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                    >
                      {/* =========================== */}
                      {/* ORDER HEADER */}
                      {/* =========================== */}
                      <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {/* Order ID */}
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Order ID
                            </p>

                            <p className="mt-1 font-bold text-gray-900">
                              #
                              {getOrderNumber(
                                order
                              )}
                            </p>
                          </div>

                          {/* Date */}
                          <div>
                            <p className="text-xs text-gray-500">
                              Order Date
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {formatDate(
                                order.createdAt ||
                                  order.orderDate
                              )}
                            </p>
                          </div>

                          {/* Items */}
                          <div>
                            <p className="text-xs text-gray-500">
                              Items
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {getItemCount(
                                order
                              )}
                            </p>
                          </div>

                          {/* Total */}
                          <div>
                            <p className="text-xs text-gray-500">
                              Total
                            </p>

                            <p className="mt-1 text-lg font-bold text-indigo-600">
                              ₹
                              {formatCurrency(
                                order.totalAmount ??
                                  order.total
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* =========================== */}
                      {/* ORDER ITEMS */}
                      {/* =========================== */}
                      <div className="px-5 py-5">
                        <div className="space-y-4">
                          {order.items
                            ?.slice(0, 3)
                            .map(
                              (
                                item,
                                index
                              ) => {
                                const product =
                                  item?.product ||
                                  {};

                                const imageUrl =
                                  getProductImage(
                                    product
                                  );

                                const itemPrice =
                                  getItemPrice(
                                    item
                                  );

                                return (
                                  <div
                                    key={
                                      item?._id ||
                                      product?._id ||
                                      index
                                    }
                                    className="flex items-center gap-4"
                                  >
                                    {/* Image */}
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                      <img
                                        src={
                                          imageUrl
                                        }
                                        alt={
                                          product?.name ||
                                          item?.name ||
                                          "Product"
                                        }
                                        className="h-full w-full object-cover"
                                        onError={(
                                          e
                                        ) => {
                                          e.currentTarget.src =
                                            "https://via.placeholder.com/100x100?text=No+Image";
                                        }}
                                      />
                                    </div>

                                    {/* Product */}
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate font-semibold text-gray-900">
                                        {product?.name ||
                                          item?.name ||
                                          "Product"}
                                      </p>

                                      <p className="mt-1 text-sm text-gray-500">
                                        Quantity:{" "}
                                        {Number(
                                          item?.quantity ||
                                            1
                                        )}
                                      </p>
                                    </div>

                                    {/* Price */}
                                    <p className="font-semibold text-gray-900">
                                      ₹
                                      {formatCurrency(
                                        itemPrice
                                      )}
                                    </p>
                                  </div>
                                );
                              }
                            )}

                          {/* More Items */}
                          {order.items?.length >
                            3 && (
                            <p className="text-sm text-gray-500">
                              +{" "}
                              {order.items
                                .length -
                                3}{" "}
                              more item
                              {order.items
                                .length -
                                3 !==
                              1
                                ? "s"
                                : ""}
                            </p>
                          )}
                        </div>

                        {/* =========================== */}
                        {/* STATUS + ACTION */}
                        {/* =========================== */}
                        <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap gap-3">
                            {/* Order Status */}
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                order.orderStatus
                              )}`}
                            >
                              Order:{" "}
                              {order.orderStatus ||
                                "placed"}
                            </span>

                            {/* Payment Status */}
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentClasses(
                                order.paymentStatus
                              )}`}
                            >
                              Payment:{" "}
                              {order.paymentStatus ||
                                "pending"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/orders/${orderId}`
                              )
                            }
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                          >
                            View Order
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Orders;
