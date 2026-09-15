
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("CATEGORY ERROR:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.minPrice) {
        params.minPrice = filters.minPrice;
      }

      if (filters.maxPrice) {
        params.maxPrice = filters.maxPrice;
      }

      if (filters.sort) {
        params.sort = filters.sort;
      }

      const response = await api.get("/products", {
        params,
      });

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("PRODUCTS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    filters.search,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
  ]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
  };

  const getPrice = (product) => {
    return product.discountPrice > 0
      ? product.discountPrice
      : product.price;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Products
          </h1>

          <p className="text-gray-600 mt-2">
            Browse products from our sellers
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>

              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>

              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                min="0"
                placeholder="₹0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>

              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                min="0"
                placeholder="₹100000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort
              </label>

              <select
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">
                  Newest
                </option>

                <option value="price_asc">
                  Price: Low to High
                </option>

                <option value="price_desc">
                  Price: High to Low
                </option>

                <option value="rating">
                  Highest Rated
                </option>
              </select>
            </div>

          </div>

          {/* Clear */}
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-600">
            {products.length} product
            {products.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-gray-600">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          /* Empty */
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div
                  className="h-56 bg-gray-100 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/products/${product._id}`
                    )
                  }
                >
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">

                  <p className="text-sm text-blue-600 font-medium">
                    {product.category?.name ||
                      "Product"}
                  </p>

                  <h2
                    className="font-semibold text-lg text-gray-800 mt-1 cursor-pointer hover:text-blue-600"
                    onClick={() =>
                      navigate(
                        `/products/${product._id}`
                      )
                    }
                  >
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-yellow-500">
                      ★
                    </span>

                    <span className="text-sm font-medium">
                      {product.rating
                        ? product.rating.toFixed(1)
                        : "0.0"}
                    </span>

                    <span className="text-sm text-gray-500">
                      ({product.numReviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-3">
                    <span className="text-xl font-bold text-gray-800">
                      ₹
                      {Number(
                        getPrice(product)
                      ).toFixed(2)}
                    </span>

                    {product.discountPrice > 0 && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        ₹
                        {Number(
                          product.price
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <p
                    className={`text-sm mt-2 font-medium ${
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() =>
                      navigate(
                        `/products/${product._id}`
                      )
                    }
                    className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700"
                  >
                    View Product
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default Products;

