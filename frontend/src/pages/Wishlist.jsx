import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

import {
  setWishlist,
  clearWishlist,
} from "../redux/slices/wishlistSlice";

function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading } = useSelector(
    (state) => state.wishlist
  );

  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      setError("");

      const response = await api.get("/wishlist");

      const wishlist =
        response.data.wishlist ||
        response.data;

      const wishlistProducts =
        wishlist?.products || [];

      dispatch(setWishlist(wishlistProducts));
    } catch (error) {
      console.error("Wishlist fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load wishlist"
      );
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Clear wishlist
  const handleClearWishlist = async () => {
    if (products.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove all products from your wishlist?"
    );

    if (!confirmed) return;

    try {
      setClearing(true);
      setError("");

      await api.delete("/wishlist");

      dispatch(clearWishlist());
    } catch (error) {
      console.error("Clear wishlist error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to clear wishlist"
      );
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gray-900 px-4 py-10 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-sm font-medium text-pink-300">
              MY ACCOUNT
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  My Wishlist
                </h1>

                <p className="mt-2 text-gray-300">
                  Save your favorite products for later.
                </p>
              </div>

              {products.length > 0 && (
                <button
                  onClick={handleClearWishlist}
                  disabled={clearing}
                  className="w-fit rounded-lg border border-red-400 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {clearing
                    ? "Clearing..."
                    : "Clear Wishlist"}
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          {/* Error */}
          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-xl bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium text-red-600">
                {error}
              </p>

              <button
                onClick={fetchWishlist}
                className="w-fit rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            /* Empty Wishlist */
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mb-5 text-7xl">
                ♡
              </div>

              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                Your Wishlist is Empty
              </h2>

              <p className="mx-auto mb-7 max-w-md text-gray-500">
                Save products you love by clicking the
                heart icon. They'll appear here for easy
                access later.
              </p>

              <button
                onClick={() => navigate("/products")}
                className="rounded-lg bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Wishlist Summary */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Saved Products
                  </h2>

                  <p className="text-sm text-gray-500">
                    {products.length} product
                    {products.length !== 1 ? "s" : ""}{" "}
                    saved
                  </p>
                </div>

                <button
                  onClick={() => navigate("/products")}
                  className="w-fit rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Wishlist;