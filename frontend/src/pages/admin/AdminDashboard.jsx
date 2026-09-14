import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-gray-600">
          Welcome, {user?.name}
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Users
            </h2>

            <p className="text-gray-500 mt-2">
              Manage customers and sellers
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Products
            </h2>

            <p className="text-gray-500 mt-2">
              Manage marketplace products
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Orders
            </h2>

            <p className="text-gray-500 mt-2">
              Manage customer orders
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;