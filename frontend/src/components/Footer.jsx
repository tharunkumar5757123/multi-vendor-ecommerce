import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-white"
            >
              Multi<span className="text-indigo-400">Shop</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              A modern multi-vendor e-commerce platform
              where customers can discover products from
              multiple sellers in one place.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold transition hover:bg-indigo-600 hover:text-white"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold transition hover:bg-indigo-600 hover:text-white"
              >
                ◎
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold transition hover:bg-indigo-600 hover:text-white"
              >
                𝕏
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold transition hover:bg-indigo-600 hover:text-white"
              >
                in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/home"
                  className="transition hover:text-indigo-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="transition hover:text-indigo-400"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="transition hover:text-indigo-400"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="transition hover:text-indigo-400"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="transition hover:text-indigo-400"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Customer
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/profile"
                  className="transition hover:text-indigo-400"
                >
                  My Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/checkout"
                  className="transition hover:text-indigo-400"
                >
                  Checkout
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="transition hover:text-indigo-400"
                >
                  Order History
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="transition hover:text-indigo-400"
                >
                  My Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="transition hover:text-indigo-400"
                >
                  Manage Addresses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="text-lg">📍</span>

                <span>
                  Hyderabad,
                  <br />
                  Telangana, India
                </span>
              </li>

              <li className="flex gap-3">
                <span className="text-lg">📧</span>

                <a
                  href="mailto:support@multishop.com"
                  className="transition hover:text-indigo-400"
                >
                  support@multishop.com
                </a>
              </li>

              <li className="flex gap-3">
                <span className="text-lg">📞</span>

                <a
                  href="tel:+919999999999"
                  className="transition hover:text-indigo-400"
                >
                  +91 99999 99999
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-center text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 sm:text-left">
          <p>
            © {new Date().getFullYear()} MultiShop.
            All rights reserved.
          </p>

          <div className="flex justify-center gap-5 sm:justify-end">
            <button
              type="button"
              className="transition hover:text-gray-300"
            >
              Privacy Policy
            </button>

            <button
              type="button"
              className="transition hover:text-gray-300"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;