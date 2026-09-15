import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "../redux/slices/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          MultiShop
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          {/* Customer Navigation */}
          {user?.role === "customer" && (
            <>
              <NavLink
                to="/home"
                className="text-gray-700 hover:text-blue-600"
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                className="text-gray-700 hover:text-blue-600"
              >
                Products
              </NavLink>

              <NavLink
                to="/cart"
                className="text-gray-700 hover:text-blue-600"
              >
                Cart
              </NavLink>
              <NavLink
  to="/profile"
  className="text-gray-700 hover:text-blue-600"
>
  Profile
</NavLink>
              <NavLink
  to="/wishlist"
  className="text-gray-700 hover:text-blue-600"
>
  Wishlist
</NavLink>

              <NavLink
                to="/orders"
                className="text-gray-700 hover:text-blue-600"
              >
                Orders
              </NavLink>
            </>
          )}

          {/* Seller Navigation */}
          {user?.role === "seller" && (
            <>
              <NavLink
                to="/seller/dashboard"
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/seller/products"
                className="text-gray-700 hover:text-blue-600"
              >
                Products
              </NavLink>

              <NavLink
                to="/seller/orders"
                className="text-gray-700 hover:text-blue-600"
              >
                Orders
              </NavLink>
            </>
          )}

          {/* Admin Navigation */}
          {user?.role === "admin" && (
            <>
              <NavLink
                to="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/users"
                className="text-gray-700 hover:text-blue-600"
              >
                Users
              </NavLink>

              <NavLink
                to="/admin/products"
                className="text-gray-700 hover:text-blue-600"
              >
                Products
              </NavLink>

              <NavLink
                to="/admin/orders"
                className="text-gray-700 hover:text-blue-600"
              >
                Orders
              </NavLink>

              <NavLink
                to="/admin/categories"
                className="text-gray-700 hover:text-blue-600"
              >
                Categories
              </NavLink>
            </>
          )}

          {/* User Name */}
          <span className="text-gray-600 font-medium">
            {user?.name}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;