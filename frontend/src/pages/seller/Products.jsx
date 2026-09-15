
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/products/seller/my-products"
      );

      setProducts(response.data.products || []);
    } catch (error) {
      console.error(
        "SELLER PRODUCTS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              My Products
            </h1>

            <p className="text-gray-600 mt-2">
              Manage your products
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/seller/products/add")
            }
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Product count */}
        <div className="mt-6">
          <p className="text-gray-600">
            Total Products:{" "}
            <span className="font-semibold text-gray-800">
              {products.length}
            </span>
          </p>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    Category
                  </th>

                  <th className="px-6 py-4">
                    Price
                  </th>

                  <th className="px-6 py-4">
                    Stock
                  </th>

                  <th className="px-6 py-4">
                    Rating
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No products found.
                      <br />

                      <button
                        onClick={() =>
                          navigate(
                            "/seller/products/add"
                          )
                        }
                        className="text-blue-600 mt-2 hover:underline"
                      >
                        Add your first product
                      </button>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t hover:bg-gray-50"
                    >

                      {/* Product */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          {product.images?.[0]?.url ? (
                            <img
                              src={
                                product.images[0].url
                              }
                              alt={product.name}
                              className="w-14 h-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                              No Image
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-800">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              SKU: {product.sku}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-gray-600">
                        {product.category?.name ||
                          "No Category"}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">

                        {product.discountPrice > 0 ? (
                          <div>

                            <p className="font-semibold text-green-600">
                              ₹{product.discountPrice}
                            </p>

                            <p className="text-sm text-gray-400 line-through">
                              ₹{product.price}
                            </p>

                          </div>
                        ) : (
                          <p className="font-semibold text-gray-800">
                            ₹{product.price}
                          </p>
                        )}

                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">

                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600 font-semibold"
                              : product.stock < 10
                              ? "text-yellow-600 font-semibold"
                              : "text-green-600 font-semibold"
                          }
                        >
                          {product.stock}
                        </span>

                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-1">

                          <span className="text-yellow-500">
                            ★
                          </span>

                          <span className="font-medium">
                            {product.rating
                              ? product.rating.toFixed(1)
                              : "0.0"}
                          </span>

                          <span className="text-sm text-gray-500">
                            ({product.numReviews || 0})
                          </span>

                        </div>

                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/seller/products/edit/${product._id}`
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Products;
