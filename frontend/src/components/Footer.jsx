import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* =========================================
          MAIN FOOTER
      ========================================= */}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-block text-2xl font-bold text-white"
            >
              Multi<span className="text-indigo-400">Shop</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
              A modern multi-vendor e-commerce platform where
              customers can discover products from multiple sellers
              in one convenient place.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:text-white"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:text-white"
              >
                ◎
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:text-white"
              >
                𝕏
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:text-white"
              >
                in
              </a>
            </div>
          </div>

          {/* =========================================
              SHOP
          ========================================= */}

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
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
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/products?category=Electronics"
                  className="transition hover:text-indigo-400"
                >
                  Electronics
                </Link>
              </li>

              <li>
                <Link
                  to="/products?category=Fashion"
                  className="transition hover:text-indigo-400"
                >
                  Fashion
                </Link>
              </li>

              <li>
                <Link
                  to="/products?category=Shoes"
                  className="transition hover:text-indigo-400"
                >
                  Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================================
              CUSTOMER
          ========================================= */}

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Customer
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/login"
                  className="transition hover:text-indigo-400"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition hover:text-indigo-400"
                >
                  Create Account
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
                  to="/wishlist"
                  className="transition hover:text-indigo-400"
                >
                  Wishlist
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

          {/* =========================================
              SELLER & SUPPORT
          ========================================= */}

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Seller & Support
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/contact-admin"
                  className="transition hover:text-indigo-400"
                >
                  Become a Seller
                </Link>
              </li>

              <li>
                <Link
                  to="/contact-admin"
                  className="transition hover:text-indigo-400"
                >
                  Contact Admin
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="transition hover:text-indigo-400"
                >
                  Browse Products
                </Link>
              </li>
            </ul>

            {/* Contact Information */}
            <div className="mt-6 space-y-3 text-sm text-gray-400">
              <div className="flex gap-3">
                <span>📍</span>

                <span>
                  Hyderabad,
                  <br />
                  Telangana, India
                </span>
              </div>

              <div className="flex gap-3">
                <span>🛒</span>

                <span>
                  Multi-vendor
                  <br />
                  Marketplace
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          NEWSLETTER STRIP
      ========================================= */}

      <div className="border-y border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h3 className="font-semibold text-white">
              Stay connected with MultiShop
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Discover products and explore our marketplace.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>

      {/* =========================================
          BOTTOM FOOTER
      ========================================= */}

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MultiShop. All rights
            reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-5 text-sm sm:justify-end">
            <button
              type="button"
              className="text-gray-500 transition hover:text-gray-300"
            >
              Privacy Policy
            </button>

            <button
              type="button"
              className="text-gray-500 transition hover:text-gray-300"
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