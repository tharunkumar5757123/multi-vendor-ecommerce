import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import api from "../services/api";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || "-createdAt"
  );

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await api.get("/categories");

      setCategories(response.data.categories || response.data || []);
    } catch (error) {
      console.error("Category fetch error:", error);
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (category) {
        params.append("category", category);
      }

      if (minPrice) {
        params.append("minPrice", minPrice);
      }

      if (maxPrice) {
        params.append("maxPrice", maxPrice);
      }

      if (sort) {
        params.append("sort", sort);
      }

      params.append("page", page);
      params.append("limit", 12);

      const response = await api.get(
        `/products?${params.toString()}`
      );

      const data = response.data;

      setProducts(data.products || []);

      if (data.pagination) {
        setPagination(data.pagination);
      } else {
        setPagination({
          currentPage: page,
          totalPages: 1,
          totalProducts: data.products?.length || 0,
        });
      }
    } catch (error) {
      console.error("Products fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, sort, page]);

  // Update URL
  useEffect(() => {
    const params = {};

    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    if (sort && sort !== "-createdAt") {
      params.sort = sort;
    }

    if (page > 1) {
      params.page = page;
    }

    setSearchParams(params, { replace: true });
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
    setSearchParams,
  ]);

  // Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Category
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  // Sort
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  // Price
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    setPage(1);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("-createdAt");
    setPage(1);
  };

  // Pagination
  const handlePrevious = () => {
    if (page > 1) {
      setPage((previous) => previous - 1);
    }
  };

  const handleNext = () => {
    if (page < pagination.totalPages) {
      setPage((previous) => previous + 1);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-gray-900 px-4 py-12 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-sm font-medium text-indigo-300">
              MULTI-VENDOR E-COMMERCE
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              All Products
            </h1>

            <p className="mt-3 max-w-2xl text-gray-300">
              Discover products from multiple sellers in one
              place.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          {/* Filters */}
          <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Find Products
              </h2>

              <button
                onClick={handleClearFilters}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Search
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={handleCategoryChange}
                  disabled={categoryLoading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">All Categories</option>

                  {categories.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Sort By
                </label>

                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="-createdAt">
                    Newest
                  </option>

                  <option value="price">
                    Price: Low to High
                  </option>

                  <option value="-price">
                    Price: High to Low
                  </option>

                  <option value="name">
                    Name: A to Z
                  </option>

                  <option value="-rating">
                    Highest Rated
                  </option>
                </select>
              </div>

              {/* Minimum Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Minimum Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="₹ Min"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Maximum Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Maximum Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder="₹ Max"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Products
              </h2>

              {!loading && (
                <p className="text-sm text-gray-500">
                  {pagination.totalProducts || products.length}{" "}
                  products found
                </p>
              )}
            </div>

            {page > 1 && (
              <span className="text-sm text-gray-500">
                Page {page} of {pagination.totalPages}
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl bg-red-50 p-6 text-center">
              <p className="font-semibold text-red-600">
                {error}
              </p>

              <button
                onClick={fetchProducts}
                className="mt-4 rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mb-4 text-5xl">🔍</div>

              <h3 className="mb-2 text-xl font-bold text-gray-900">
                No Products Found
              </h3>

              <p className="mb-6 text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={handleClearFilters}
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            )}

          {/* Pagination */}
          {!loading &&
            !error &&
            products.length > 0 &&
            pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                <span className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white">
                  {page} / {pagination.totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={page >= pagination.totalPages}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Products;