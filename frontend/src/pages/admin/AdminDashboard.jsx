
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// import Navbar from "../../components/Navbar";
import api from "../../services/api";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        // Backend returns:
        // { message, dashboard: {...} }
        setDashboard(response.data.dashboard);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* <Navbar /> */}

        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>

            <p className="text-gray-600 mt-4">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* <Navbar /> */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl">
            <h2 className="font-semibold text-lg">
              Dashboard Error
            </h2>

            <p className="mt-1">
              {error}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Navbar /> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || "Admin"}
          </p>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Customers
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {dashboard?.totalUsers || 0}
                </h2>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
          </div>

          {/* Sellers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Sellers
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {dashboard?.totalSellers || 0}
                </h2>
              </div>

              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                🏪
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Products
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {dashboard?.totalProducts || 0}
                </h2>
              </div>

              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                📦
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Orders
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {dashboard?.totalOrders || 0}
                </h2>
              </div>

              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                🛒
              </div>
            </div>
          </div>

        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500">
              Pending Orders
            </p>

            <div className="flex items-end justify-between mt-2">
              <h2 className="text-3xl font-bold text-yellow-600">
                {dashboard?.pendingOrders || 0}
              </h2>

              <span className="text-sm text-gray-500">
                Active orders
              </span>
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500">
              Delivered Orders
            </p>

            <div className="flex items-end justify-between mt-2">
              <h2 className="text-3xl font-bold text-green-600">
                {dashboard?.deliveredOrders || 0}
              </h2>

              <span className="text-sm text-gray-500">
                Completed orders
              </span>
            </div>
          </div>

        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
          <p className="text-sm font-medium text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            ₹{Number(dashboard?.totalRevenue || 0).toLocaleString("en-IN")}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Revenue from paid orders
          </p>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest orders placed by customers
              </p>
            </div>
          </div>

          {!dashboard?.recentOrders ||
          dashboard.recentOrders.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                No orders found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-gray-200">

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Customer
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Payment
                    </th>

                    <th className="py-3 px-2 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {dashboard.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      {/* Customer */}
                      <td className="py-4 px-2">
                        <p className="font-medium text-gray-800">
                          {order.user?.name || "Unknown"}
                        </p>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-2 text-gray-600">
                        {order.user?.email || "-"}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-2 font-medium text-gray-800">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-2">

                        <span className="capitalize text-sm text-gray-600">
                          {order.paymentMethod || "-"}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            order.orderStatus === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.orderStatus === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.orderStatus === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.orderStatus || "unknown"}
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;
