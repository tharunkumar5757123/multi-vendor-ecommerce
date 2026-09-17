
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/slices/authSlice";
import api from "../../services/api";

function SellerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/sellers/dashboard");

      setDashboard(
        response.data.dashboard || response.data
      );
    } catch (err) {
      console.error(
        "SELLER DASHBOARD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load seller dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading seller dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">
            Unable to load dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || dashboard || {};

  const totalProducts =
    stats.totalProducts || 0;

  const activeProducts =
    stats.activeProducts || 0;

  const totalOrders =
    stats.totalOrders || 0;

  const totalRevenue =
    stats.totalRevenue || 0;

  const pendingOrders =
    stats.pendingOrders || 0;

  const deliveredOrders =
    stats.deliveredOrders || 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Seller Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your products and orders
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Add Product */}
            {/* <button
              type="button"
              onClick={() =>
                navigate("/seller/products/add")
              }
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
            >
              + Add Product
            </button> */}

            {/* Logout */}
            {/* <button
              type="button"
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Logout
            </button> */}

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Products
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalProducts}
                </p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                📦
              </div>

            </div>

            <p className="text-sm text-green-600 mt-4">
              {activeProducts} active
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalOrders}
                </p>
              </div>

              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                🛒
              </div>

            </div>

            <p className="text-sm text-orange-600 mt-4">
              {pendingOrders} pending
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Revenue
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{Number(totalRevenue).toFixed(2)}
                </p>
              </div>

              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                ₹
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              From your orders
            </p>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Delivered
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {deliveredOrders}
                </p>
              </div>

              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                ✓
              </div>

            </div>

            <p className="text-sm text-green-600 mt-4">
              Successfully delivered
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Manage Products */}
            <button
              type="button"
              onClick={() =>
                navigate("/seller/products")
              }
              className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition"
            >
              <div className="text-3xl mb-4">
                📦
              </div>

              <h3 className="font-bold text-lg text-gray-900">
                Manage Products
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                View, edit and manage your products.
              </p>
            </button>

            {/* Add Product */}
            <button
              type="button"
              onClick={() =>
                navigate("/sellers/products/add")
              }
              className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition"
            >
              <div className="text-3xl mb-4">
                ➕
              </div>

              <h3 className="font-bold text-lg text-gray-900">
                Add Product
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Add a new product to your store.
              </p>
            </button>

            {/* Manage Orders */}
            <button
              type="button"
              onClick={() =>
                navigate("/seller/orders")
              }
              className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition"
            >
              <div className="text-3xl mb-4">
                🚚
              </div>

              <h3 className="font-bold text-lg text-gray-900">
                Manage Orders
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                View and update your customer orders.
              </p>
            </button>

          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">

          <h2 className="text-xl font-bold text-gray-900">
            Store Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            <div>
              <p className="text-sm text-gray-500">
                Active Products
              </p>

              <p className="text-2xl font-bold mt-1">
                {activeProducts}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Pending Orders
              </p>

              <p className="text-2xl font-bold mt-1">
                {pendingOrders}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Delivered Orders
              </p>

              <p className="text-2xl font-bold mt-1">
                {deliveredOrders}
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default SellerDashboard;
