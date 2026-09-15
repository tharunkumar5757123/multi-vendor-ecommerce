
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function SellerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingItems: 0,
    deliveredItems: 0,
    totalSales: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/sellers/dashboard"
      );

      const data = response.data;

      setDashboard({
        totalProducts: data.totalProducts || 0,
        totalOrders: data.totalOrders || 0,
        pendingItems: data.pendingItems || 0,
        deliveredItems: data.deliveredItems || 0,
        totalSales: data.totalSales || 0,
      });
    } catch (error) {
      console.error(
        "SELLER DASHBOARD ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load seller dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Seller Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your products and orders
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

          {/* Products */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Total Products
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {dashboard.totalProducts}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Products you sell
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Total Orders
            </p>

            <h2 className="text-3xl font-bold text-indigo-600 mt-2">
              {dashboard.totalOrders}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Orders containing your products
            </p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Pending Items
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {dashboard.pendingItems}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Items awaiting delivery
            </p>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Delivered Items
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {dashboard.deliveredItems}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Successfully delivered
            </p>
          </div>

          {/* Sales */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Total Sales
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              ₹{Number(
                dashboard.totalSales
              ).toFixed(2)}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Your product sales
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Products */}
            <button
              onClick={() =>
                navigate("/seller/products")
              }
              className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Manage Products
              </h3>

              <p className="text-gray-500 mt-2">
                View, edit and delete your products.
              </p>

              <span className="inline-block mt-4 text-blue-600 font-medium">
                View Products →
              </span>
            </button>

            {/* Add Product */}
            <button
              onClick={() =>
                navigate("/seller/products/add")
              }
              className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Add Product
              </h3>

              <p className="text-gray-500 mt-2">
                Add a new product to your store.
              </p>

              <span className="inline-block mt-4 text-green-600 font-medium">
                Add Product →
              </span>
            </button>

            {/* Orders */}
            <button
              onClick={() =>
                navigate("/seller/orders")
              }
              className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Manage Orders
              </h3>

              <p className="text-gray-500 mt-2">
                View orders and update product status.
              </p>

              <span className="inline-block mt-4 text-purple-600 font-medium">
                View Orders →
              </span>
            </button>

          </div>
        </div>

        {/* Seller Workflow */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Seller Workflow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>

              <p className="font-medium mt-3">
                Add Product
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                2
              </div>

              <p className="font-medium mt-3">
                Customer Orders
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">
                3
              </div>

              <p className="font-medium mt-3">
                Confirm Order
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                4
              </div>

              <p className="font-medium mt-3">
                Ship Product
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                5
              </div>

              <p className="font-medium mt-3">
                Delivered
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default SellerDashboard;
