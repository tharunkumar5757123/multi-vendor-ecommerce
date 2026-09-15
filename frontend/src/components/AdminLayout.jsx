
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import { logout } from "../redux/slices/authSlice";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6">
            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-2xl text-gray-700 hover:bg-gray-100 lg:hidden"
            >
              ☰
            </button>

            {/* Page Header */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-gray-800">
                Admin Panel
              </h2>

              <p className="text-sm text-gray-500">
                Manage your marketplace
              </p>
            </div>

            {/* Right Section */}
            <div className="ml-auto flex items-center gap-4">
              {/* Notification */}
              <button
                className="relative rounded-full p-2 text-xl text-gray-600 hover:bg-gray-100"
                title="Notifications"
              >
                🔔

                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Admin Profile */}
              <div className="hidden items-center gap-3 border-l pl-4 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "Admin"}
                  </p>

                  <p className="text-xs capitalize text-gray-500">
                    {user?.role || "admin"}
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="hidden rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 sm:block"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
