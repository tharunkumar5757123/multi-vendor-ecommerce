import { NavLink } from "react-router-dom";

function SellerSidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/seller/dashboard",
      icon: "📊",
    },
    {
      name: "Products",
      path: "/seller/products",
      icon: "📦",
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: "🛒",
    },
    {
       name: "Add Product",
      path: "/sellers/products/add",
      icon: "➕",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
          <div>
            <h1 className="text-xl font-bold text-blue-600">
              ShopBasket
            </h1>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Seller Panel
            </p>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Seller Info */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              S
            </div>

            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                Seller
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Seller Account
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Seller Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
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

        {/* Bottom */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              Seller Panel
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Manage your products and orders
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SellerSidebar;