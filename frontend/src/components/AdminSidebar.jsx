
import { NavLink } from "react-router-dom";

function AdminSidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "📦",
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: "🗂️",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "🛒",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-gray-900 text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-700 px-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">
              MultiShop
            </h1>

            <p className="text-xs text-gray-400">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white lg:hidden"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Management
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <NavLink
            to="/"
            onClick={onClose}
            className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            <span>🏠</span>
            <span>Go to Home</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
