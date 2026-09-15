import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import api from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error("Cart fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Get cart items
  const cartItems = cart?.items || [];

  // Product can be populated or just an object ID
  const getProduct = (item) => {
    return item.product || {};
  };

  // Get product image
  const getImageUrl = (product) => {
    if (!product.images?.length) {
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

  // Get effective price
  const getPrice = (product) => {
    if (
      product.discountPrice &&
      product.discountPrice < product.price
    ) {
      return Number(product.discountPrice);
    }

    return Number(product.price || 0);
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const product = getProduct(item);

    return total + getPrice(product) * item.quantity;
  }, 0);

  // Backend checkout uses ₹1000 shipping threshold
  const shipping = subtotal >= 1000 ? 0 : 50;

  // Backend order calculation uses 5% tax
  const tax = subtotal * 0.05;

  const total = subtotal + shipping + tax;

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await api.put(`/cart/${productId}`, {
        quantity,
      });

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error("Quantity update error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      setActionLoading(true);

      const response = await api.delete(`/cart/${productId}`);

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error("Remove item error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await api.delete("/cart");

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error("Clear cart error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    navigate("/checkout");
  };

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

  if (error) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">⚠️</div>

            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Unable to Load Cart
            </h2>

            <p className="mb-6 text-gray-500">
              {error}
            </p>

            <button
              onClick={fetchCart}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
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
              <div className="mb-5 text-6xl">🛒</div>

              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                Your Cart is Empty
              </h2>

              <p className="mb-7 text-gray-500">
                You haven't added any products to your cart yet.
              </p>

              <button
                onClick={() => navigate("/products")}
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
                    onClick={handleClearCart}
                    disabled={actionLoading}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = getProduct(item);
                    const price = getPrice(product);
                    const itemTotal =
                      price * item.quantity;

                    return (
                      <div
                        key={item.product?._id || item.product}
                        className="rounded-2xl bg-white p-4 shadow-sm"
                      >
                        <div className="flex flex-col gap-5 sm:flex-row">
                          {/* Image */}
                          <div
                            className="h-28 w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32"
                            onClick={() =>
                              product._id &&
                              navigate(
                                `/products/${product._id}`
                              )
                            }
                          >
                            <img
                              src={getImageUrl(product)}
                              alt={product.name || "Product"}
                              className="h-full w-full object-cover transition hover:scale-105"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  {product.brand && (
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                      {product.brand}
                                    </p>
                                  )}

                                  <h3
                                    onClick={() =>
                                      product._id &&
                                      navigate(
                                        `/products/${product._id}`
                                      )
                                    }
                                    className="cursor-pointer text-lg font-bold text-gray-900 hover:text-indigo-600"
                                  >
                                    {product.name ||
                                      "Product"}
                                  </h3>
                                </div>

                                <button
                                  onClick={() =>
                                    removeItem(
                                      product._id
                                    )
                                  }
                                  disabled={actionLoading}
                                  className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
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
                                  onClick={() =>
                                    updateQuantity(
                                      product._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={
                                    actionLoading ||
                                    item.quantity <= 1
                                  }
                                  className="px-4 py-2 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  −
                                </button>

                                <span className="min-w-12 border-x border-gray-300 px-4 py-2 text-center font-semibold">
                                  {item.quantity}
                                </span>

                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      product._id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    actionLoading ||
                                    item.quantity >=
                                      product.stock
                                  }
                                  className="px-4 py-2 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
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
                        {subtotal.toLocaleString("en-IN")}
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
                        {tax.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          Total
                        </span>

                        <span className="text-2xl font-bold text-indigo-600">
                          ₹
                          {total.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Message */}
                  {subtotal < 1000 && (
                    <div className="mt-5 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
                      Add ₹
                      {(1000 - subtotal).toLocaleString(
                        "en-IN"
                      )}{" "}
                      more to get free shipping.
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={actionLoading}
                    className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate("/products")}
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