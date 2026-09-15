import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");

      setUsers(response.data.users);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (user) => {
    try {
      const response = await api.put(
        `/admin/users/${user._id}/status`,
        {
          isActive: !user.isActive,
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === user._id
            ? response.data.user
            : item
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update user status"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        <h1 className="text-4xl font-bold text-gray-800">
          User Management
        </h1>

        <p className="text-gray-600 mt-2">
          Manage customers and sellers
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

                  <th className="px-6 py-4">
                    Name
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Role
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {users.map((user) => (

                  <tr
                    key={user._id}
                    className="border-t"
                  >

                    <td className="px-6 py-4 font-medium">
                      {user.name}
                    </td>

                    <td className="px-6 py-4">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {user.role}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={
                          user.isActive
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <button
                        onClick={() =>
                          handleStatusChange(user)
                        }
                        className={
                          user.isActive
                            ? "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            : "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        }
                      >
                        {user.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Users;