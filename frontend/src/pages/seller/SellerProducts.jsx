import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import {
  showConfirmToast,
  showToast,
} from "../../utils/showToast";

function SellerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  // ----------------------------------
  // Fetch Products
  // ----------------------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/products/seller/my-products"
      );

      setProducts(response.data?.products || []);
    } catch (error) {
      console.error(
        "FETCH SELLER PRODUCTS ERROR:",
        error
      );

      showToast(
        "error",
        "Products unavailable",
        error.response?.data?.message ||
          "Failed to load your products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ----------------------------------
  // Filter Products
  // ----------------------------------
  const filteredProducts = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return products.filter((product) => {
      const matchesSearch =
        !searchText ||
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.brand
          ?.toLowerCase()
          .includes(searchText) ||
        product.sku
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          product.isActive) ||
        (statusFilter === "inactive" &&
          !product.isActive) ||
        (statusFilter === "outofstock" &&
          Number(product.stock) <= 0);

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [products, search, statusFilter]);

  // ----------------------------------
  // Get Price
  // ----------------------------------
  const getPrice = (product) => {
    return Number(product.discountPrice) > 0
      ? Number(product.discountPrice)
      : Number(product.price || 0);
  };

  // ----------------------------------
  // Get Image
  // ----------------------------------
  const getProductImage = (product) => {
    const firstImage = product.images?.[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    return (
      firstImage?.url ||
      "https://via.placeholder.com/100?text=No+Image"
    );
  };

  // ----------------------------------
  // Delete Product
  // ----------------------------------
  const handleDelete = async (productId) => {
    const confirmed =
      await showConfirmToast({
        title: "Delete product?",
        message:
          "This product will be permanently deleted.",
        confirmText: "Delete",
      });

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(productId);

      await api.delete(
        `/products/${productId}`
      );

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) =>
            product._id !== productId
        )
      );

      showToast(
        "success",
        "Product deleted",
        "Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      showToast(
        "error",
        "Delete failed",
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ----------------------------------
  // Clear Filters
  // ----------------------------------
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Products
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage your products and inventory
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/seller/dashboard"
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                Dashboard
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/seller/products/add"
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                + Add Product
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Products
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by name, brand or SKU..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div className="w-full md:w-56">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Clear */}
            {(search ||
              statusFilter !== "all") && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {products.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

            <p className="mt-4 text-gray-500">
              Loading products...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          filteredProducts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">
                📦
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                {products.length === 0
                  ? "No products yet"
                  : "No products found"}
              </h2>

              <p className="text-gray-500 mt-2">
                {products.length === 0
                  ? "Start selling by adding your first product."
                  : "Try changing your search or filter."}
              </p>

              {products.length === 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/seller/products/add"
                    )
                  }
                  className="mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
                >
                  Add Your First Product
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

        {/* Desktop Table */}
        {!loading &&
          filteredProducts.length > 0 && (
            <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                        Product
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                        Price
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                        Stock
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                        Rating
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>

                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {filteredProducts.map(
                      (product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50"
                        >
                          {/* Product */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={getProductImage(
                                  product
                                )}
                                alt={
                                  product.name
                                }
                                className="w-16 h-16 object-cover rounded-lg border"
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.src =
                                    "https://via.placeholder.com/100?text=No+Image";
                                }}
                              />

                              <div>
                                <h3 className="font-semibold text-gray-800 max-w-xs">
                                  {product.name}
                                </h3>

                                {product.brand && (
                                  <p className="text-sm text-gray-500">
                                    {
                                      product.brand
                                    }
                                  </p>
                                )}

                                {product.sku && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    SKU:{" "}
                                    {
                                      product.sku
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">
                              ₹
                              {getPrice(
                                product
                              ).toFixed(2)}
                            </p>

                            {Number(
                              product.discountPrice
                            ) > 0 && (
                              <p className="text-xs text-gray-400 line-through">
                                ₹
                                {Number(
                                  product.price ||
                                    0
                                ).toFixed(2)}
                              </p>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="px-6 py-4">
                            <span
                              className={
                                Number(
                                  product.stock
                                ) > 0
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {product.stock}
                            </span>
                          </td>

                          {/* Rating */}
                          <td className="px-6 py-4">
                            <span className="text-yellow-500">
                              ★
                            </span>{" "}
                            {Number(
                              product.rating ||
                                0
                            ).toFixed(1)}

                            <span className="text-gray-400 text-sm">
                              {" "}
                              (
                              {
                                product.numReviews ||
                                0
                              }
                              )
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {product.isActive ? (
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                Inactive
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/seller/products/edit/${product._id}`
                                  )
                                }
                                className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product._id
                                  )
                                }
                                disabled={
                                  deleteLoading ===
                                  product._id
                                }
                                className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                              >
                                {deleteLoading ===
                                product._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Mobile / Tablet */}
        {!loading &&
          filteredProducts.length > 0 && (
            <div className="lg:hidden grid gap-4">
              {filteredProducts.map(
                (product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm p-4"
                  >
                    <div className="flex gap-4">
                      <img
                        src={getProductImage(
                          product
                        )}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg border"
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://via.placeholder.com/100?text=No+Image";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800">
                          {product.name}
                        </h3>

                        {product.brand && (
                          <p className="text-sm text-gray-500 mt-1">
                            {product.brand}
                          </p>
                        )}

                        <p className="font-bold text-gray-900 mt-2">
                          ₹
                          {getPrice(
                            product
                          ).toFixed(2)}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Stock:{" "}
                          <span
                            className={
                              Number(
                                product.stock
                              ) > 0
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {product.stock}
                          </span>
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          ★{" "}
                          {Number(
                            product.rating ||
                              0
                          ).toFixed(1)}{" "}
                          (
                          {
                            product.numReviews ||
                            0
                          }
                          )
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div>
                        {product.isActive ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/seller/products/edit/${product._id}`
                            )
                          }
                          className="px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                          disabled={
                            deleteLoading ===
                            product._id
                          }
                          className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleteLoading ===
                          product._id
                            ? "..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </main>
    </div>
  );
}

export default SellerProducts;