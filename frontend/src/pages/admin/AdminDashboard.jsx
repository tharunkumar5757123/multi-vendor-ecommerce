import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar";
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

        setDashboard(response.data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        </div>
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
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Welcome, {user?.name}
          </p>
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Customers
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {dashboard?.totalUsers || 0}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Sellers
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {dashboard?.totalSellers || 0}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Products
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {dashboard?.totalProducts || 0}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Orders
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {dashboard?.totalOrders || 0}
            </h2>
          </div>

        </div>

        {/* Order Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Pending Orders
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {dashboard?.pendingOrders || 0}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Delivered Orders
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {dashboard?.deliveredOrders || 0}
            </h2>
          </div>

        </div>

        {/* Revenue */}

        <div className="bg-white rounded-xl shadow mt-8 p-6">

          <p className="text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-4xl font-bold mt-2">
            ₹{dashboard?.totalRevenue || 0}
          </h2>

        </div>

        {/* Recent Orders */}

        <div className="bg-white rounded-xl shadow mt-8 p-6">

          <h2 className="text-2xl font-semibold">
            Recent Orders
          </h2>

          {dashboard?.recentOrders?.length === 0 ? (

            <p className="text-gray-500 mt-4">
              No orders found.
            </p>

          ) : (

            <div className="overflow-x-auto mt-5">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b">

                    <th className="py-3">
                      Customer
                    </th>

                    <th className="py-3">
                      Email
                    </th>

                    <th className="py-3">
                      Amount
                    </th>

                    <th className="py-3">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {dashboard?.recentOrders?.map(
                    (order) => (

                      <tr
                        key={order._id}
                        className="border-b"
                      >

                        <td className="py-3">
                          {order.user?.name}
                        </td>

                        <td className="py-3">
                          {order.user?.email}
                        </td>

                        <td className="py-3">
                          ₹{order.totalAmount}
                        </td>

                        <td className="py-3">
                          {order.orderStatus}
                        </td>

                      </tr>

                    )
                  )}

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