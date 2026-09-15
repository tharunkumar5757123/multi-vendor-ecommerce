import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data.order || response.data);
    } catch (error) {
      console.error("Order details error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load order details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Format date and time
  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status classes
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

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Payment classes
  const getPaymentClasses = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Product image
  const getProductImage = (product) => {
    const image = product?.images?.[0];

    if (!image) {
      return "https://via.placeholder.com/150x150?text=No+Image";
    }

    if (typeof image === "string") {
      return image;
    }

    return (
      image.url ||
      "https://via.placeholder.com/150x150?text=No+Image"
    );
  };

  // Get order number
  const getOrderNumber = () => {
    return (
      order?.orderId ||
      order?.orderNumber ||
      order?._id?.slice(-8).toUpperCase() ||
      "N/A"
    );
  };

  // Get address
  const address = order?.shippingAddress || {};

  // Status timeline
  const statusSteps = [
    {
      key: "placed",
      title: "Order Placed",
      description: "Your order has been placed successfully.",
    },
    {
      key: "confirmed",
      title: "Order Confirmed",
      description: "Your order has been confirmed.",
    },
    {
      key: "processing",
      title: "Processing",
      description: "Your seller is preparing your order.",
    },
    {
      key: "shipped",
      title: "Shipped",
      description: "Your order is on the way.",
    },
    {
      key: "delivered",
      title: "Delivered",
      description: "Your order has been delivered.",
    },
  ];

  const getStatusIndex = () => {
    const currentStatus = order?.orderStatus;

    if (currentStatus === "cancelled") {
      return -1;
    }

    return statusSteps.findIndex(
      (step) => step.key === currentStatus
    );
  };

  const currentStatusIndex = getStatusIndex();

  // Calculate items total
  const itemsSubtotal =
    order?.items?.reduce((total, item) => {
      return (
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0)
      );
    }, 0) || 0;

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>

        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">📦</div>

            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Order Not Found
            </h2>

            <p className="mb-6 text-gray-500">
              {error ||
                "We couldn't find this order."}
            </p>

            <button
              onClick={() => navigate("/orders")}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Back to Orders
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gray-900 px-4 py-10 text-white">
          <div className="mx-auto max-w-7xl">
            <button
              onClick={() => navigate("/orders")}
              className="mb-5 text-sm text-gray-300 hover:text-white"
            >
              ← Back to Orders
            </button>

            <p className="mb-2 text-sm font-medium text-indigo-300">
              ORDER DETAILS
            </p>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  Order #{getOrderNumber()}
                </h1>

                <p className="mt-2 text-gray-300">
                  Placed on{" "}
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus || "placed"}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          {/* Cancelled */}
          {order.orderStatus === "cancelled" && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex gap-3">
                <span className="text-xl">⚠️</span>

                <div>
                  <p className="font-bold text-red-800">
                    Order Cancelled
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    This order has been cancelled and will
                    not be delivered.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main */}
            <div className="space-y-8 lg:col-span-2">
              {/* Order Status */}
              {order.orderStatus !== "cancelled" && (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="mb-8 text-xl font-bold text-gray-900">
                    Order Status
                  </h2>

                  <div className="relative">
                    {/* Desktop line */}
                    <div className="absolute left-0 right-0 top-5 hidden h-1 bg-gray-200 md:block" />

                    <div className="grid gap-6 md:grid-cols-5">
                      {statusSteps.map(
                        (step, index) => {
                          const completed =
                            index <= currentStatusIndex;

                          return (
                            <div
                              key={step.key}
                              className="relative flex gap-4 md:block md:text-center"
                            >
                              <div
                                className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold md:mx-auto ${
                                  completed
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {completed
                                  ? "✓"
                                  : index + 1}
                              </div>

                              <div className="md:mt-3">
                                <p
                                  className={`text-sm font-bold ${
                                    completed
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.title}
                                </p>

                                <p className="mt-1 hidden text-xs text-gray-500 md:block">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Products */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Ordered Items
                </h2>

                <div className="space-y-5">
                  {order.items?.map((item, index) => {
                    const product =
                      item.product || {};

                    const itemPrice = Number(
                      item.price || 0
                    );

                    const quantity = Number(
                      item.quantity || 0
                    );

                    return (
                      <div
                        key={
                          item._id ||
                          product._id ||
                          index
                        }
                        className="flex flex-col gap-4 border-b border-gray-200 pb-5 last:border-b-0 last:pb-0 sm:flex-row"
                      >
                        {/* Image */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          <img
                            src={getProductImage(
                              product
                            )}
                            alt={
                              product.name ||
                              item.name ||
                              "Product"
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {product.name ||
                                item.name ||
                                "Product"}
                            </h3>

                            {product.brand && (
                              <p className="mt-1 text-sm text-gray-500">
                                {product.brand}
                              </p>
                            )}

                            <p className="mt-2 text-sm text-gray-500">
                              ₹
                              {itemPrice.toLocaleString(
                                "en-IN"
                              )}{" "}
                              × {quantity}
                            </p>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                item.status ||
                                  order.orderStatus
                              )}`}
                            >
                              {item.status ||
                                order.orderStatus ||
                                "placed"}
                            </span>

                            {item.seller && (
                              <span className="text-xs text-gray-500">
                                Seller:{" "}
                                {item.seller.name ||
                                  item.seller.email ||
                                  item.seller}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹
                            {(
                              itemPrice * quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Delivery Address
                </h2>

                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="font-bold text-gray-900">
                    {address.fullName || "N/A"}
                  </p>

                  {address.phone && (
                    <p className="mt-1 text-sm text-gray-600">
                      {address.phone}
                    </p>
                  )}

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {address.addressLine1}
                    {address.addressLine2 &&
                      `, ${address.addressLine2}`}
                    {address.city &&
                      `, ${address.city}`}
                    {address.state &&
                      `, ${address.state}`}
                    {address.postalCode &&
                      ` - ${address.postalCode}`}
                    {address.country &&
                      `, ${address.country}`}
                  </p>
                </div>
              </div>

              {/* Order Information */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Order Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-semibold text-gray-900">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Order Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDateTime(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold uppercase text-gray-900">
                      {order.paymentMethod || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Payment Status
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentClasses(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus ||
                        "pending"}
                    </span>
                  </div>

                  {order.paidAt && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Paid At
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {formatDateTime(order.paidAt)}
                      </p>
                    </div>
                  )}

                  {order.deliveredAt && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Delivered At
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {formatDateTime(
                          order.deliveredAt
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Items</span>

                    <span className="font-medium text-gray-900">
                      {order.items?.reduce(
                        (total, item) =>
                          total +
                          Number(
                            item.quantity || 0
                          ),
                        0
                      ) || 0}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>

                    <span className="font-medium text-gray-900">
                      ₹
                      {Number(
                        order.subtotal ||
                          itemsSubtotal
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>

                    <span className="font-medium text-gray-900">
                      {Number(
                        order.shippingPrice ||
                          order.shippingCost ||
                          0
                      ) === 0
                        ? "FREE"
                        : `₹${Number(
                            order.shippingPrice ||
                              order.shippingCost ||
                              0
                          ).toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>

                    <span className="font-medium text-gray-900">
                      ₹
                      {Number(
                        order.tax || 0
                      ).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-indigo-600">
                        ₹
                        {Number(
                          order.totalAmount ||
                            order.total ||
                            0
                        ).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="mt-6 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold uppercase text-gray-800">
                      {order.paymentMethod || "N/A"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentClasses(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus ||
                        "pending"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/orders")}
                  className="mt-6 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Back to Orders
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="mt-3 w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default OrderDetails;