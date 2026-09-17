import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import SellerSidebar from "./SellerSidebar";
import { logout } from "../redux/slices/authSlice";

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

function SellerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  // ============================
  // Theme
  // ============================

  useEffect(() => {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle(
      "dark",
      isDark
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  };

  // ============================
  // Logout
  // ============================

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 transition-colors duration-300 dark:bg-gray-950">

      {/* Sidebar */}

      <SellerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}

      <div className="lg:ml-64">

        {/* Header */}

        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6">

            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-lg p-2 text-2xl text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Open sidebar"
              title="Open menu"
            >
              ☰
            </button>

            {/* Desktop Title */}

            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Seller Panel
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your store
              </p>
            </div>

            {/* Right Side */}

            <div className="ml-auto flex items-center gap-3 sm:gap-4">

              {/* Profile */}

              <button
                type="button"
                onClick={() =>
                  navigate("/seller/profile")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
              >
                👤 Profile
              </button>

              {/* User */}

              <div className="hidden items-center gap-3 border-l border-gray-200 pl-4 dark:border-gray-700 sm:flex">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "S"}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.name || "Seller"}
                  </p>

                  <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                    {user?.role || "seller"}
                  </p>
                </div>

              </div>

              {/* Theme */}

              <ThemeToggle
                theme={theme}
                onToggle={toggleTheme}
              />

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 sm:block"
              >
                Logout
              </button>

            </div>
          </div>
        </header>

        {/* Page Content */}

        <main className="min-h-[calc(100vh-5rem)] bg-gray-100 p-4 transition-colors duration-300 dark:bg-gray-950 sm:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

export default SellerLayout;