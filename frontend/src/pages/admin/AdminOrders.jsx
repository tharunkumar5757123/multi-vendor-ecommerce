
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (showToast = false) => {
    try {
      setRefreshing(true);

      const response = await api.get("/orders/admin/all");

      setOrders(response.data?.orders || []);

      if (showToast) {
        toast.success("Orders refreshed successfully.");
      }
    } catch (error) {
      console.error("Admin orders error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "confirmed":
        return "bg-indigo-100 text-indigo-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getPaymentClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase().trim();

      const orderId =
        order._id?.toLowerCase() || "";

      const customerName =
        order.user?.name?.toLowerCase() || "";

      const customerEmail =
        order.user?.email?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
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
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;

  const pendingOrders = orders.filter((order) =>
    [
      "placed",
      "confirmed",
      "processing",
      "shipped",
    ].includes(order.orderStatus)
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

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");

    toast.success("Filters cleared.");
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Admin
          </p>

          <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
            Order Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and monitor all customer orders.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            className={
              refreshing ? "animate-spin" : ""
            }
          >
            ↻
          </span>

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Orders
          </p>

          <p className="mt-2 text-2xl font-black text-gray-900">
            {totalOrders}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            All customer orders
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-amber-700">
            Pending
          </p>

          <p className="mt-2 text-2xl font-black text-amber-700">
            {pendingOrders}
          </p>

          <p className="mt-1 text-xs text-amber-600">
            Active orders
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">
            Delivered
          </p>

          <p className="mt-2 text-2xl font-black text-emerald-700">
            {deliveredOrders}
          </p>

          <p className="mt-1 text-xs text-emerald-600">
            Completed orders
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-700">
            Cancelled
          </p>

          <p className="mt-2 text-2xl font-black text-red-700">
            {cancelledOrders}
          </p>

          <p className="mt-1 text-xs text-red-600">
            Cancelled orders
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-indigo-700">
            Paid Revenue
          </p>

          <p className="mt-2 text-xl font-black text-indigo-700 sm:text-2xl">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-xs text-indigo-600">
            Successful payments
          </p>
        </div>
      </div>

      {/* Filters */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Filters
            </h2>

            <p className="text-xs text-gray-500">
              Find orders quickly.
            </p>
          </div>

          {(search ||
            statusFilter !== "all" ||
            paymentFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Search */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Search Orders
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Order ID, name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Order Status */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Order Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Payment Status
            </label>

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
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

              <option value="refunded">
                Refunded
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              All Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {totalOrders}
              </span>{" "}
              orders
            </p>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="text-5xl">📦</div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filters.
            </p>

            {(search ||
              statusFilter !== "all" ||
              paymentFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Items
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    {/* Order */}

                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-800">
                        #{order._id?.slice(-8)}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </p>
                    </td>

                    {/* Customer */}

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {order.user?.name ||
                          "Unknown"}
                      </p>

                      <p className="mt-1 max-w-[220px] truncate text-sm text-gray-500">
                        {order.user?.email || "-"}
                      </p>
                    </td>

                    {/* Items */}

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-semibold text-gray-700">
                        {order.items?.length || 0}
                      </span>
                    </td>

                    {/* Amount */}

                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-800">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </td>

                    {/* Payment */}

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium capitalize text-gray-700">
                        {order.paymentMethod ||
                          "-"}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${getPaymentClass(
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
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
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
                        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
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

      {/* Order Details Modal */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedOrder(null)
          }
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Order
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-900 sm:text-2xl">
                  Order Details
                </h2>

                <p className="mt-1 break-all text-xs text-gray-500">
                  #{selectedOrder._id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}

            <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">
              {/* Customer */}

              <section className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Customer Information
                </h3>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="font-bold text-gray-900">
                    {selectedOrder.user?.name ||
                      "Unknown"}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {selectedOrder.user?.email ||
                      "-"}
                  </p>

                  {selectedOrder.user?.phone && (
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedOrder.user.phone}
                    </p>
                  )}
                </div>
              </section>

              {/* Shipping */}

              <section className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Shipping Address
                </h3>

                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-bold text-gray-900">
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

                  <p className="mt-1">
                    {selectedOrder.shippingAddress
                      ?.city || "-"}
                    ,{" "}
                    {selectedOrder.shippingAddress
                      ?.state || "-"}
                  </p>

                  <p className="mt-1">
                    Pincode:{" "}
                    {selectedOrder.shippingAddress
                      ?.pincode || "-"}
                  </p>
                </div>
              </section>

              {/* Products */}

              <section className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
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
                            item.product
                              ?.images?.[0]?.url ||
                            "";

                      return (
                        <div
                          key={
                            item.product?._id ||
                            index
                          }
                          className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={
                                item.name ||
                                "Product"
                              }
                              className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                              No Image
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-800">
                              {item.name ||
                                item.product
                                  ?.name ||
                                "Product"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity:{" "}
                              {item.quantity ||
                                0}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Item Status:{" "}
                              <span className="font-medium capitalize text-gray-700">
                                {item.itemStatus ||
                                  "-"}
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="font-bold text-gray-800">
                              ₹
                              {Number(
                                item.subtotal || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </section>

              {/* Summary */}

              <section className="border-t border-gray-200 pt-5">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-800">
                      ₹
                      {Number(
                        selectedOrder.subtotal ||
                          0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Shipping
                    </span>

                    <span className="font-medium text-gray-800">
                      ₹
                      {Number(
                        selectedOrder.shippingFee ||
                          0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Tax
                    </span>

                    <span className="font-medium text-gray-800">
                      ₹
                      {Number(
                        selectedOrder.tax || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-black">
                    <span>Total</span>

                    <span>
                      ₹
                      {Number(
                        selectedOrder.totalAmount ||
                          0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </section>

              {/* Payment / Status */}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Payment Method
                  </p>

                  <p className="mt-1 font-bold capitalize text-gray-800">
                    {selectedOrder.paymentMethod ||
                      "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Payment Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getPaymentClass(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {selectedOrder.paymentStatus ||
                      "pending"}
                  </span>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Order Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus ||
                      "unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="border-t border-gray-200 bg-gray-50 p-5 sm:p-6">
              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="w-full rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
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
