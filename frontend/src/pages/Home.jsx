
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await api.get("/categories");

      setCategories(
        response.data.categories || []
      );
    } catch (error) {
      console.error(
        "Categories error:",
        error
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setError("");

      const response = await api.get(
        "/products?limit=8&sort=-createdAt"
      );

      setProducts(
        response.data.products || []
      );
    } catch (error) {
      console.error(
        "Products error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  const getCategoryImage = (category) => {
    if (!category?.image) {
      return "";
    }

    return category.image;
  };

  const handleCategoryClick = (category) => {
    navigate(
      `/products?category=${category._id}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Text */}
          <div className="text-white">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Welcome to MultiShop
            </span>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Everything you need,
              <span className="block text-blue-200">
                all in one place.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Discover quality products from
              trusted sellers and enjoy a simple,
              secure and convenient shopping
              experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() =>
                  navigate("/products")
                }
                className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg transition hover:bg-gray-100"
              >
                Shop Now
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("categories")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="rounded-lg border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Browse Categories
              </button>
            </div>
          </div>

          {/* Hero Card */}
          <div className="hidden lg:block">
            <div className="relative mx-auto max-w-md">
              <div className="rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-white p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-4xl">
                      🛍️
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Secure Shopping
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    Shop with confidence
                  </h3>

                  <p className="mt-3 text-gray-500">
                    Quality products, trusted sellers
                    and secure payments.
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-blue-50 p-4 text-center">
                      <div className="text-2xl">
                        📦
                      </div>
                      <p className="mt-1 text-xs font-medium text-gray-600">
                        Products
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-4 text-center">
                      <div className="text-2xl">
                        🚚
                      </div>
                      <p className="mt-1 text-xs font-medium text-gray-600">
                        Delivery
                      </p>
                    </div>

                    <div className="rounded-xl bg-purple-50 p-4 text-center">
                      <div className="text-2xl">
                        🔒
                      </div>
                      <p className="mt-1 text-xs font-medium text-gray-600">
                        Secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Explore
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-800">
              Shop by Category
            </h2>

            <p className="mt-2 text-gray-500">
              Find products from your favorite
              categories.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/products")
            }
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 sm:block"
          >
            View All →
          </button>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-xl bg-gray-200"
                />
              )
            )}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              No categories available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories
              .slice(0, 6)
              .map((category) => {
                const image =
                  getCategoryImage(category);

                return (
                  <button
                    key={category._id}
                    onClick={() =>
                      handleCategoryClick(
                        category
                      )
                    }
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-28 items-center justify-center overflow-hidden bg-gray-100">
                      {image ? (
                        <img
                          src={image}
                          alt={category.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-4xl">
                          🗂️
                        </span>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {category.name}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </section>

      {/* Products */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Fresh Arrivals
              </p>

              <h2 className="mt-1 text-3xl font-bold text-gray-800">
                Latest Products
              </h2>

              <p className="mt-2 text-gray-500">
                Check out the latest products from
                our sellers.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/products")
              }
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 sm:block"
            >
              View All →
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {loadingProducts ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-96 animate-pulse rounded-xl bg-gray-200"
                  />
                )
              )}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-12 text-center">
              <div className="text-5xl">
                📦
              </div>

              <p className="mt-4 text-gray-500">
                No products available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Why MultiShop?
          </p>

          <h2 className="mt-1 text-3xl font-bold text-gray-800">
            Shopping made simple
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
              🔒
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Secure Payments
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Secure checkout with trusted payment
              options.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              🚚
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Easy Delivery
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Track your orders from purchase to
              delivery.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
              ⭐
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Quality Products
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Discover products from multiple
              sellers.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl">
              🛍️
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              Easy Shopping
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Search, compare and buy products
              easily.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
