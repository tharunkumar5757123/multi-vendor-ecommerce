
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "../redux/slices/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive
        ? "text-indigo-600"
        : "text-gray-700 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ================= LOGO ================= */}
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
              M
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Multi<span className="text-indigo-600">Shop</span>
            </span>
          </NavLink>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden items-center gap-6 lg:flex">

            {/* ================= GUEST ================= */}
            {!isAuthenticated && (
              <>
                <NavLink
                  to="/"
                  className={navLinkClass}
                >
                  Home
                </NavLink>

                <NavLink
                  to="/products"
                  className={navLinkClass}
                >
                  Products
                </NavLink>

                {/* <NavLink
                  to="/register"
                  className={navLinkClass}
                >
                  Become a Seller
                </NavLink> */}

                <NavLink
                  to="/login"
                  className="font-medium text-gray-700 transition hover:text-indigo-600"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Register
                </NavLink>
              </>
            )}

            {/* ================= CUSTOMER ================= */}
            {isAuthenticated &&
              user?.role === "customer" && (
                <>
                  <NavLink
                    to="/"
                    className={navLinkClass}
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/products"
                    className={navLinkClass}
                  >
                    Products
                  </NavLink>

                  <NavLink
                    to="/cart"
                    className={navLinkClass}
                  >
                    Cart
                  </NavLink>

                  <NavLink
                    to="/wishlist"
                    className={navLinkClass}
                  >
                    Wishlist
                  </NavLink>

                  <NavLink
                    to="/orders"
                    className={navLinkClass}
                  >
                    Orders
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={navLinkClass}
                  >
                    Profile
                  </NavLink>
                </>
              )}

            {/* ================= SELLER ================= */}
            {isAuthenticated &&
              user?.role === "seller" && (
                <>
                  <NavLink
                    to="/seller/dashboard"
                    className={navLinkClass}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/seller/products"
                    className={navLinkClass}
                  >
                    Products
                  </NavLink>

                  <NavLink
                    to="/seller/orders"
                    className={navLinkClass}
                  >
                    Orders
                  </NavLink>
                </>
              )}

            {/* ================= ADMIN ================= */}
            {isAuthenticated &&
              user?.role === "admin" && (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    className={navLinkClass}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/users"
                    className={navLinkClass}
                  >
                    Users
                  </NavLink>

                  <NavLink
                    to="/admin/products"
                    className={navLinkClass}
                  >
                    Products
                  </NavLink>

                  <NavLink
                    to="/admin/orders"
                    className={navLinkClass}
                  >
                    Orders
                  </NavLink>

                  <NavLink
                    to="/admin/categories"
                    className={navLinkClass}
                  >
                    Categories
                  </NavLink>
                </>
              )}

            {/* ================= USER INFO ================= */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 border-l border-gray-200 pl-5">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>

                <div className="hidden xl:block">
                  <p className="max-w-[120px] truncate text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>

                  <p className="text-xs capitalize text-gray-500">
                    {user.role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 py-4 lg:hidden">

            <div className="flex flex-col gap-2">

              {/* ================= GUEST ================= */}
              {!isAuthenticated && (
                <>
                  <NavLink
                    to="/"
                    onClick={closeMobileMenu}
                    className={navLinkClass}
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/products"
                    onClick={closeMobileMenu}
                    className={navLinkClass}
                  >
                    Products
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={closeMobileMenu}
                    className={navLinkClass}
                  >
                    Become a Seller
                  </NavLink>

                  <div className="mt-2 flex gap-3 border-t border-gray-100 pt-4">
                    <NavLink
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-center font-semibold text-gray-700"
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to="/register"
                      onClick={closeMobileMenu}
                      className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center font-semibold text-white"
                    >
                      Register
                    </NavLink>
                  </div>
                </>
              )}

              {/* ================= CUSTOMER ================= */}
              {isAuthenticated &&
                user?.role === "customer" && (
                  <>
                    <NavLink
                      to="/"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Home
                    </NavLink>

                    <NavLink
                      to="/products"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Products
                    </NavLink>

                    <NavLink
                      to="/cart"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Cart
                    </NavLink>

                    <NavLink
                      to="/wishlist"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Wishlist
                    </NavLink>

                    <NavLink
                      to="/orders"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Orders
                    </NavLink>

                    <NavLink
                      to="/profile"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Profile
                    </NavLink>
                  </>
                )}

              {/* ================= SELLER ================= */}
              {isAuthenticated &&
                user?.role === "seller" && (
                  <>
                    <NavLink
                      to="/seller/dashboard"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/seller/products"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Products
                    </NavLink>

                    <NavLink
                      to="/seller/orders"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Orders
                    </NavLink>
                  </>
                )}

              {/* ================= ADMIN ================= */}
              {isAuthenticated &&
                user?.role === "admin" && (
                  <>
                    <NavLink
                      to="/admin/dashboard"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/admin/users"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Users
                    </NavLink>

                    <NavLink
                      to="/admin/products"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Products
                    </NavLink>

                    <NavLink
                      to="/admin/orders"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Orders
                    </NavLink>

                    <NavLink
                      to="/admin/categories"
                      onClick={closeMobileMenu}
                      className={navLinkClass}
                    >
                      Categories
                    </NavLink>
                  </>
                )}

              {/* ================= MOBILE USER ================= */}
              {isAuthenticated && user && (
                <div className="mt-3 border-t border-gray-100 pt-4">

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.name}
                      </p>

                      <p className="text-sm capitalize text-gray-500">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;