import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");

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
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
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
      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Product Management
        </h1>

        <p className="text-gray-600 mt-2">
          Manage all products in the marketplace
        </p>

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs">
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

                      <td className="px-6 py-4">
                        {product.seller?.name || "Unknown"}
                      </td>

                      <td className="px-6 py-4">
                        {product.category?.name || "Unknown"}
                      </td>

                      <td className="px-6 py-4">
                        ₹{product.discountPrice > 0
                          ? product.discountPrice
                          : product.price}
                      </td>

                      <td className="px-6 py-4">
                        {product.stock}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            product.isActive
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {product.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
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