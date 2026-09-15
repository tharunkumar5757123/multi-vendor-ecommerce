
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import {
  showConfirmToast,
  showToast,
} from "../../utils/showToast";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/admin/all");

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Products error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get first product image
  const getImageUrl = (product) => {
    if (!product?.images || product.images.length === 0) {
      return "";
    }

    const image = product.images[0];

    if (typeof image === "string") {
      return image;
    }

    return image?.url || "";
  };

  // Activate / Deactivate product
  const handleStatusChange = async (
    productId,
    currentStatus
  ) => {
    try {
      setUpdatingId(productId);

      const response = await api.put(
        `/products/${productId}/status`,
        {
          isActive: !currentStatus,
        }
      );

      const updatedProduct = response.data.product;

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                isActive: updatedProduct.isActive,
              }
            : product
        )
      );
    } catch (error) {
      console.error("Status update error:", error);

      showToast(
        "error",
        "Status update failed",
        error.response?.data?.message ||
          "Failed to update product status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete product
  const handleDelete = async (
    productId,
    productName
  ) => {
    const confirmed = await showConfirmToast({
      title: "Delete product?",
      message: `"${productName}" will be permanently deleted.`,
      confirmText: "Delete",
    });

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);

      await api.delete(`/products/${productId}`);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== productId
        )
      );

      showToast(
        "success",
        "Product deleted",
        "Product deleted successfully."
      );
    } catch (error) {
      console.error("Delete product error:", error);

      showToast(
        "error",
        "Delete failed",
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim();

    const productName =
      product.name?.toLowerCase() || "";

    const brand =
      product.brand?.toLowerCase() || "";

    const sku =
      product.sku?.toLowerCase() ||
      product.SKU?.toLowerCase() ||
      "";

    const matchesSearch =
      productName.includes(searchText) ||
      brand.includes(searchText) ||
      sku.includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        product.isActive === true) ||
      (statusFilter === "inactive" &&
        product.isActive === false) ||
      (statusFilter === "outofstock" &&
        Number(product.stock) === 0);

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.isActive === true
  ).length;

  const inactiveProducts = products.filter(
    (product) => product.isActive === false
  ).length;

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) === 0
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Product Management
          </h1>

          <p className="mt-2 text-gray-600">
            Manage all products listed by sellers.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error}</p>

          <button
            onClick={fetchProducts}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {totalProducts}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              📦
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {activeProducts}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              ✓
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Inactive Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-600">
                {inactiveProducts}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
              ✕
            </div>
          </div>
        </div>

        {/* Out of stock */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Out of Stock
              </p>

              <h2 className="mt-2 text-3xl font-bold text-orange-600">
                {outOfStockProducts}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              ⚠
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search Products
            </label>

            <input
              type="text"
              placeholder="Search by name, brand or SKU..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Filter by Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Products
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

              <option value="outofstock">
                Out of Stock
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-gray-800">
            All Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Showing {filteredProducts.length} of{" "}
            {totalProducts} products
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

            <p className="mt-4 text-gray-500">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty */
          <div className="py-16 text-center">
            <div className="mb-3 text-5xl">
              📦
            </div>

            <p className="font-medium text-gray-700">
              No products found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-600">
                    SKU
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-600">
                    Seller
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-600">
                    Stock
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const imageUrl =
                    getImageUrl(product);

                  const finalPrice =
                    product.discountPrice > 0
                      ? product.discountPrice
                      : product.price;

                  return (
                    <tr
                      key={product._id}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex min-w-[250px] items-center gap-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                              No Image
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-gray-800">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {product.brand ||
                                "No brand"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-5 py-4 text-gray-600">
                        {product.sku ||
                          product.SKU ||
                          "-"}
                      </td>

                      {/* Seller */}
                      <td className="px-5 py-4 text-gray-600">
                        <div>
                          <p>
                            {product.seller?.name ||
                              "Unknown"}
                          </p>

                          {product.seller?.email && (
                            <p className="mt-1 text-xs text-gray-400">
                              {product.seller.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          ₹
                          {Number(
                            finalPrice || 0
                          ).toLocaleString("en-IN")}
                        </p>

                        {product.discountPrice > 0 &&
                          product.discountPrice <
                            product.price && (
                            <p className="text-xs text-gray-400 line-through">
                              ₹
                              {Number(
                                product.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span
                          className={
                            Number(product.stock) ===
                            0
                              ? "font-medium text-red-600"
                              : Number(product.stock) <
                                10
                              ? "font-medium text-orange-600"
                              : "text-gray-700"
                          }
                        >
                          {product.stock ?? 0}
                        </span>

                        {Number(product.stock) ===
                          0 && (
                          <p className="text-xs text-red-500">
                            Out of stock
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            product.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex min-w-[250px] flex-wrap items-center gap-2">
                          {/* View */}
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/products/${product._id}`
                              )
                            }
                            disabled={
                              updatingId ===
                                product._id ||
                              deletingId ===
                                product._id
                            }
                            className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-200 disabled:opacity-50"
                          >
                            View
                          </button>

                          {/* Activate / Deactivate */}
                          <button
                            onClick={() =>
                              handleStatusChange(
                                product._id,
                                product.isActive
                              )
                            }
                            disabled={
                              updatingId ===
                                product._id ||
                              deletingId ===
                                product._id
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:opacity-50 ${
                              product.isActive
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {updatingId ===
                            product._id
                              ? "Updating..."
                              : product.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDelete(
                                product._id,
                                product.name
                              )
                            }
                            disabled={
                              deletingId ===
                                product._id ||
                              updatingId ===
                                product._id
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                          >
                            {deletingId ===
                            product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
