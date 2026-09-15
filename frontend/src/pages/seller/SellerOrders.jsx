import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function SellerOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  // ======================================================
  // Fetch Seller Orders
  // ======================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/seller/my-orders"
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "SELLER ORDERS ERROR:",
        error
      );

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

  // ======================================================
  // Get Next Statuses
  // ======================================================

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

  // ======================================================
  // Update Product Order Status
  // ======================================================

  const handleStatusUpdate = async (
    orderId,
    productId,
    status
  ) => {
    if (!productId) {
      setError(
        "Product information is missing"
      );
      return;
    }

    try {
      setUpdating(
        `${orderId}-${productId}`
      );

      setError("");

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

  // ======================================================
  // Format Date
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

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
  // Format Date + Time
  // ======================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ======================================================
  // Status Badge
  // ======================================================

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

  // ======================================================
  // Payment Badge
  // ======================================================

  const getPaymentStatusClass = (
    paymentStatus
  ) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ======================================================
  // Payment Method
  // ======================================================

  const formatPaymentMethod = (
    paymentMethod
  ) => {
    if (!paymentMethod) {
      return "-";
    }

    if (paymentMethod === "cod") {
      return "Cash on Delivery";
    }

    if (paymentMethod === "online") {
      return "Online Payment";
    }

    return paymentMethod;
  };

  // ======================================================
  // Product Image
  // ======================================================

  const getProductImage = (item) => {
    // Order item image
    if (
      item?.image &&
      typeof item.image === "object" &&
      item.image.url
    ) {
      return item.image.url;
    }

    // If image is directly a string
    if (
      item?.image &&
      typeof item.image === "string"
    ) {
      return item.image;
    }

    // Populated product image fallback
    if (
      item?.product?.images &&
      item.product.images.length > 0
    ) {
      const firstImage =
        item.product.images[0];

      if (
        typeof firstImage === "object" &&
        firstImage.url
      ) {
        return firstImage.url;
      }

      if (
        typeof firstImage === "string"
      ) {
        return firstImage;
      }
    }

    return "";
  };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-600 mt-4">
              Loading seller orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // Main UI
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ============================================
            Header
        ============================================ */}

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Seller Orders
          </h1>

          <p className="text-gray-600 mt-2">
            Manage orders containing your products
          </p>
        </div>

        {/* ============================================
            Error
        ============================================ */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>

            <button
              onClick={() => setError("")}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* ============================================
            Summary Cards
        ============================================ */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          {/* Total Orders */}

          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {orders.length}
            </p>
          </div>

          {/* Pending Orders */}

          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Active Orders
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {
                orders.filter(
                  (order) =>
                    ![
                      "delivered",
                      "cancelled",
                    ].includes(
                      order.orderStatus
                    )
                ).length
              }
            </p>
          </div>

          {/* Completed */}

          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Completed Orders
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {
                orders.filter(
                  (order) =>
                    order.orderStatus ===
                    "delivered"
                ).length
              }
            </p>
          </div>
        </div>

        {/* ============================================
            Empty State
        ============================================ */}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 sm:p-12 text-center">
            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-2xl font-semibold text-gray-700">
              No orders found
            </h2>

            <p className="text-gray-500 mt-2">
              Orders containing your products
              will appear here.
            </p>
          </div>
        ) : (
          /* ==========================================
             Orders
          ========================================== */

          <div className="space-y-6">

            {orders.map((order) => {
              const orderId =
                order.orderId;

              return (
                <div
                  key={orderId}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >

                  {/* ==================================
                     Order Header
                  ================================== */}

                  <div className="px-4 sm:px-6 py-5 border-b bg-gray-50">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

                      {/* Order ID */}

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Order ID
                        </p>

                        <p className="font-semibold text-gray-800 mt-1 break-all">
                          #
                          {String(
                            orderId
                          )
                            .slice(-8)
                            .toUpperCase()}
                        </p>
                      </div>

                      {/* Date */}

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Order Date
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                          {formatDate(
                            order.createdAt
                          )}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(
                            order.createdAt
                          )}
                        </p>
                      </div>

                      {/* Seller Total */}

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Your Total
                        </p>

                        <p className="font-bold text-green-600 text-lg mt-1">
                          ₹
                          {Number(
                            order.sellerSubtotal ||
                              0
                          ).toFixed(2)}
                        </p>
                      </div>

                      {/* Payment */}

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Payment
                        </p>

                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {formatPaymentMethod(
                            order.paymentMethod
                          )}
                        </p>

                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus ||
                            "pending"}
                        </span>
                      </div>

                      {/* Overall Status */}

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Order Status
                        </p>

                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* ==================================
                     Customer
                  ================================== */}

                  <div className="px-4 sm:px-6 py-5 border-b">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Customer Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                      <div>
                        <p className="text-xs text-gray-500">
                          Name
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                          {order.customer?.name ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Email
                        </p>

                        <p className="font-medium text-gray-800 mt-1 break-all">
                          {order.customer?.email ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Phone
                        </p>

                        <p className="font-medium text-gray-800 mt-1">
                          {order.customer?.phone ||
                            "-"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* ==================================
                     Products
                  ================================== */}

                  <div className="p-4 sm:p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Your Products
                    </h2>

                    <div className="space-y-4">

                      {order.items?.map(
                        (item) => {
                          const nextStatuses =
                            getNextStatuses(
                              item.itemStatus
                            );

                          const productId =
                            item.product?._id ||
                            item.product;

                          const updateKey = `${orderId}-${productId}`;

                          const productImage =
                            getProductImage(
                              item
                            );

                          return (
                            <div
                              key={
                                item._id ||
                                productId
                              }
                              className="border border-gray-200 rounded-xl p-4"
                            >

                              <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">

                                {/* Product Info */}

                                <div className="flex gap-4">

                                  {productImage ? (
                                    <img
                                      src={
                                        productImage
                                      }
                                      alt={
                                        item.name ||
                                        "Product"
                                      }
                                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border"
                                    />
                                  ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                      No Image
                                    </div>
                                  )}

                                  <div>
                                    <h3 className="font-semibold text-gray-800">
                                      {item.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                      Quantity:{" "}
                                      {
                                        item.quantity
                                      }
                                    </p>

                                    <p className="text-sm text-gray-500">
                                      Price: ₹
                                      {Number(
                                        item.price ||
                                          0
                                      ).toFixed(
                                        2
                                      )}
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                      Subtotal: ₹
                                      {Number(
                                        item.subtotal ||
                                          0
                                      ).toFixed(
                                        2
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {/* Product Status */}

                                <div className="lg:text-right">

                                  <p className="text-sm text-gray-500 mb-2">
                                    Product Status
                                  </p>

                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                      item.itemStatus
                                    )}`}
                                  >
                                    {
                                      item.itemStatus
                                    }
                                  </span>

                                  {/* Status Buttons */}

                                  {nextStatuses.length >
                                    0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 lg:justify-end">

                                      {nextStatuses.map(
                                        (
                                          status
                                        ) => (
                                          <button
                                            key={
                                              status
                                            }
                                            type="button"
                                            onClick={() =>
                                              handleStatusUpdate(
                                                orderId,
                                                productId,
                                                status
                                              )
                                            }
                                            disabled={
                                              updating ===
                                              updateKey
                                            }
                                            className={`px-3 py-2 rounded-lg text-sm font-medium text-white transition disabled:bg-gray-400 disabled:cursor-not-allowed ${
                                              status ===
                                              "cancelled"
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-blue-600 hover:bg-blue-700"
                                            }`}
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

                                  {/* Completed */}

                                  {nextStatuses.length ===
                                    0 && (
                                    <p className="text-xs text-gray-500 mt-3">
                                      No further
                                      actions
                                    </p>
                                  )}

                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}

                    </div>
                  </div>

                  {/* ==================================
                     Shipping Address
                  ================================== */}

                  <div className="border-t px-4 sm:px-6 py-5 bg-gray-50">

                    <h2 className="font-semibold text-gray-800 mb-3">
                      Shipping Address
                    </h2>

                    <div className="text-sm text-gray-600 space-y-1">

                      <p className="font-medium text-gray-800">
                        {
                          order.shippingAddress
                            ?.fullName
                        }
                      </p>

                      <p>
                        {
                          order.shippingAddress
                            ?.phone
                        }
                      </p>

                      <p>
                        {
                          order.shippingAddress
                            ?.address
                        }
                      </p>

                      <p>
                        {
                          order.shippingAddress
                            ?.city
                        }
                        ,{" "}
                        {
                          order.shippingAddress
                            ?.state
                        }{" "}
                        -{" "}
                        {
                          order.shippingAddress
                            ?.pincode
                        }
                      </p>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default SellerOrders;