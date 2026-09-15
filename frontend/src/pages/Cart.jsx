
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import api from "../services/api";
import {
  showConfirmToast,
  showToast,
} from "../utils/showToast";

function Cart() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const isCustomer =
    isAuthenticated && user?.role === "customer";

  // ---------------------------------------
  // Fetch Cart
  // ---------------------------------------
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error("Cart fetch error:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isCustomer) {
      navigate("/unauthorized");
      return;
    }

    fetchCart();
  }, [isAuthenticated, user?.role]);

  // ---------------------------------------
  // Cart Items
  // ---------------------------------------
  const cartItems = cart?.items || [];

  // ---------------------------------------
  // Get Product
  // ---------------------------------------
  const getProduct = (item) => {
    return item?.product || {};
  };

  // ---------------------------------------
  // Get Product Image
  // ---------------------------------------
  const getImageUrl = (product) => {
    if (!product?.images?.length) {
      return "https://via.placeholder.com/300x300?text=No+Image";
    }

    const image = product.images[0];

    if (typeof image === "string") {
      return image;
    }

    return (
      image?.url ||
      "https://via.placeholder.com/300x300?text=No+Image"
    );
  };

  // ---------------------------------------
  // Get Effective Product Price
  // ---------------------------------------
  const getPrice = (product) => {
    if (
      product?.discountPrice &&
      product.discountPrice < product.price
    ) {
      return Number(product.discountPrice);
    }

    return Number(product?.price || 0);
  };

  // ---------------------------------------
  // Calculate Totals
  // ---------------------------------------
  const subtotal = cartItems.reduce((total, item) => {
    const product = getProduct(item);

    return (
      total +
      getPrice(product) * Number(item?.quantity || 0)
    );
  }, 0);

  // Same calculation as backend order controller
  const shipping = subtotal >= 1000 ? 0 : 50;

  const tax = subtotal * 0.05;

  const total = subtotal + shipping + tax;

  // ---------------------------------------
  // Update Quantity
  // ---------------------------------------
  const updateQuantity = async (productId, quantity) => {
    if (!productId || quantity < 1) {
      return;
    }

    const item = cartItems.find(
      (cartItem) =>
        cartItem?.product?._id === productId
    );

    const product = item?.product;

    if (product && quantity > product.stock) {
      showToast(
        "warning",
        "Stock limit reached",
        `Only ${product.stock} item${
          product.stock === 1 ? "" : "s"
        } available in stock.`
      );
      return;
    }

    try {
      setActionLoading(true);

      const response = await api.put(
        `/cart/${productId}`,
        {
          quantity,
        }
      );

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error(
        "Quantity update error:",
        error
      );

      showToast(
        "error",
        "Quantity update failed",
        error.response?.data?.message ||
          "Failed to update quantity."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------
  // Remove Item
  // ---------------------------------------
  const removeItem = async (productId) => {
    if (!productId) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await api.delete(
        `/cart/${productId}`
      );

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error("Remove item error:", error);

      showToast(
        "error",
        "Remove failed",
        error.response?.data?.message ||
          "Failed to remove product."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------
  // Clear Cart
  // ---------------------------------------
  const handleClearCart = async () => {
    const confirmed = await showConfirmToast({
      title: "Clear cart?",
      message: "This will remove all products from your cart.",
      confirmText: "Clear Cart",
    });

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await api.delete("/cart");

      setCart(response.data.cart || response.data);

      showToast(
        "success",
        "Cart cleared",
        "All products were removed from your cart."
      );
    } catch (error) {
      console.error("Clear cart error:", error);

      showToast(
        "error",
        "Clear cart failed",
        error.response?.data?.message ||
          "Failed to clear cart."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------
  // Checkout
  // ---------------------------------------
  const handleCheckout = () => {
    if (cartItems.length === 0 || actionLoading) {
      return;
    }

    navigate("/checkout");
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
          <Loader text="Loading your cart..." />
        </div>

        <Footer />
      </>
    );
  }

  // ---------------------------------------
  // Error
  // ---------------------------------------
  if (error) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">
              ⚠️
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Unable to Load Cart
            </h2>

            <p className="mb-6 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchCart}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Try Again
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
            <p className="mb-2 text-sm font-medium text-indigo-300">
              SHOPPING CART
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Your Cart
            </h1>

            <p className="mt-2 text-gray-300">
              Review your products before checkout.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          {/* Empty Cart */}
          {cartItems.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mb-5 text-6xl">
                🛒
              </div>

              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                Your Cart is Empty
              </h2>

              <p className="mb-7 text-gray-500">
                You haven't added any products to your
                cart yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="rounded-lg bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Cart Items ({cartItems.length})
                  </h2>

                  <button
                    type="button"
                    onClick={handleClearCart}
                    disabled={actionLoading}
                    className="text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product =
                      getProduct(item);

                    const price =
                      getPrice(product);

                    const itemTotal =
                      price *
                      Number(item.quantity || 0);

                    const productId =
                      product?._id ||
                      item?.product;

                    const isOutOfStock =
                      !product?._id ||
                      product.stock <= 0;

                    return (
                      <div
                        key={productId}
                        className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex flex-col gap-5 sm:flex-row">
                          {/* Image */}
                          <div
                            className="h-28 w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32"
                            onClick={() =>
                              product?._id &&
                              navigate(
                                `/products/${product._id}`
                              )
                            }
                          >
                            <img
                              src={getImageUrl(product)}
                              alt={
                                product?.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/300x300?text=No+Image";
                              }}
                            />
                          </div>

                          {/* Details */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  {product?.brand && (
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                      {product.brand}
                                    </p>
                                  )}

                                  <h3
                                    onClick={() =>
                                      product?._id &&
                                      navigate(
                                        `/products/${product._id}`
                                      )
                                    }
                                    className="cursor-pointer text-lg font-bold text-gray-900 transition hover:text-indigo-600"
                                  >
                                    {product?.name ||
                                      "Product"}
                                  </h3>

                                  {isOutOfStock && (
                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                      Product currently
                                      unavailable
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      product?._id
                                    )
                                  }
                                  disabled={
                                    actionLoading ||
                                    !product?._id
                                  }
                                  className="text-sm font-medium text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Remove
                                </button>
                              </div>

                              <p className="mt-2 text-sm text-gray-500">
                                ₹
                                {price.toLocaleString(
                                  "en-IN"
                                )}{" "}
                                each
                              </p>
                            </div>

                            {/* Bottom */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                              {/* Quantity */}
                              <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product?._id,
                                      Number(
                                        item.quantity
                                      ) - 1
                                    )
                                  }
                                  disabled={
                                    actionLoading ||
                                    !product?._id ||
                                    Number(
                                      item.quantity
                                    ) <= 1
                                  }
                                  className="px-4 py-2 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  −
                                </button>

                                <span className="min-w-12 border-x border-gray-300 px-4 py-2 text-center font-semibold">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product?._id,
                                      Number(
                                        item.quantity
                                      ) + 1
                                    )
                                  }
                                  disabled={
                                    actionLoading ||
                                    !product?._id ||
                                    isOutOfStock ||
                                    Number(
                                      item.quantity
                                    ) >=
                                      Number(
                                        product.stock
                                      )
                                  }
                                  className="px-4 py-2 text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  +
                                </button>
                              </div>

                              {/* Item Total */}
                              <p className="text-lg font-bold text-gray-900">
                                ₹
                                {itemTotal.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>

                      <span className="font-medium text-gray-900">
                        ₹
                        {subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>

                      <span className="font-medium text-gray-900">
                        {shipping === 0
                          ? "FREE"
                          : `₹${shipping}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Tax (5%)</span>

                      <span className="font-medium text-gray-900">
                        ₹
                        {tax.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          Total
                        </span>

                        <span className="text-2xl font-bold text-indigo-600">
                          ₹
                          {total.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Message */}
                  {subtotal < 1000 && (
                    <div className="mt-5 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
                      Add ₹
                      {(
                        1000 - subtotal
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      more to get free shipping.
                    </div>
                  )}

                  {/* Checkout */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={actionLoading}
                    className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/products")
                    }
                    className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>

                  <div className="mt-6 border-t border-gray-200 pt-5 text-center text-xs text-gray-500">
                    🔒 Secure checkout
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Cart;
