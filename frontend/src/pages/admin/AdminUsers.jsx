
import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Users error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      setUpdatingId(userId);

      const response = await api.put(
        `/admin/users/${userId}/status`,
        {
          isActive: !currentStatus,
        }
      );

      const updatedUser = response.data.user;

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                isActive: updatedUser.isActive,
              }
            : user
        )
      );
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update user status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.phone?.toLowerCase().includes(searchText);

    const matchesRole =
      roleFilter === "all" ||
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;

  const customers = users.filter(
    (user) => user.role === "customer"
  ).length;

  const sellers = users.filter(
    (user) => user.role === "seller"
  ).length;

  const admins = users.filter(
    (user) => user.role === "admin"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            User Management
          </h1>

          <p className="text-gray-600 mt-2">
            Manage customers, sellers and administrators.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {totalUsers}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Customers
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {customers}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Sellers
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {sellers}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Admins
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {admins}
            </h2>
          </div>

        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>

              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="seller">Sellers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

          </div>

        </div>

        {/* Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">

          <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Users
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredUsers.length} of {totalUsers} users
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>

              <p className="text-gray-500 mt-4">
                Loading users...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                No users found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      User
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      {/* User */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </div>

                          <div>
                            <p className="font-medium text-gray-800">
                              {user.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              Joined{" "}
                              {user.createdAt
                                ? new Date(
                                    user.createdAt
                                  ).toLocaleDateString()
                                : "-"}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-gray-600">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-gray-600">
                        {user.phone || "-"}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            user.role === "admin"
                              ? "bg-gray-200 text-gray-800"
                              : user.role === "seller"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">

                        {user.role === "admin" ? (
                          <span className="text-xs text-gray-400">
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                user._id,
                                user.isActive
                              )
                            }
                            disabled={
                              updatingId === user._id
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              user.isActive
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            } disabled:opacity-50`}
                          >
                            {updatingId === user._id
                              ? "Updating..."
                              : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}

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

export default AdminUsers;
