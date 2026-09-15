
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description:
        "Get your favorite products delivered quickly and safely to your doorstep.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description:
        "Your payments are protected with secure and trusted payment processing.",
    },
    {
      icon: "🏪",
      title: "Trusted Sellers",
      description:
        "Shop from multiple sellers and discover products from trusted businesses.",
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      description:
        "Simple and convenient shopping experience with customer-friendly returns.",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      icon: "💻",
      description: "Laptops, phones & gadgets",
    },
    {
      name: "Fashion",
      icon: "👕",
      description: "Clothing & accessories",
    },
    {
      name: "Home & Living",
      icon: "🏠",
      description: "Everything for your home",
    },
    {
      name: "Beauty",
      icon: "✨",
      description: "Beauty & personal care",
    },
    {
      name: "Sports",
      icon: "⚽",
      description: "Fitness & sports equipment",
    },
    {
      name: "Accessories",
      icon: "🎧",
      description: "Useful everyday accessories",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-white">

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

            <div className="grid items-center gap-12 lg:grid-cols-2">

              {/* Hero Content */}
              <div className="text-center lg:text-left">

                <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-indigo-100 backdrop-blur">
                  ✨ Your one-stop shopping destination
                </div>

                <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Everything You Need,
                  <span className="block text-indigo-300">
                    All in One Place.
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-indigo-100 sm:text-lg lg:mx-0">
                  Discover quality products from trusted sellers,
                  enjoy secure payments, and experience a simple
                  shopping journey built for everyone.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

                  <button
                    onClick={() => navigate("/products")}
                    className="rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
                  >
                    Shop Now →
                  </button>

                  {/* <button
                    onClick={() => navigate("/register")}
                    className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Create Account
                  </button> */}

                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-indigo-100 lg:justify-start">
                  <span>✓ Secure Checkout</span>
                  <span>✓ Trusted Sellers</span>
                  <span>✓ Easy Shopping</span>
                </div>

              </div>

              {/* Hero Visual */}
              <div className="relative hidden lg:block">

                <div className="relative mx-auto max-w-lg">

                  <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-lg">

                    <div className="rounded-2xl bg-white p-5">

                      <div className="mb-5 flex items-center justify-between">

                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            FEATURED COLLECTION
                          </p>

                          <h3 className="mt-1 text-xl font-bold text-gray-900">
                            Shop Everything
                          </h3>
                        </div>

                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                          NEW
                        </span>

                      </div>

                      <div className="grid grid-cols-2 gap-4">

                        <div className="rounded-2xl bg-gray-100 p-6 text-center">
                          <div className="text-5xl">💻</div>
                          <p className="mt-3 font-bold text-gray-800">
                            Electronics
                          </p>
                        </div>

                        <div className="rounded-2xl bg-indigo-50 p-6 text-center">
                          <div className="text-5xl">👕</div>
                          <p className="mt-3 font-bold text-gray-800">
                            Fashion
                          </p>
                        </div>

                        <div className="rounded-2xl bg-purple-50 p-6 text-center">
                          <div className="text-5xl">🏠</div>
                          <p className="mt-3 font-bold text-gray-800">
                            Home
                          </p>
                        </div>

                        <div className="rounded-2xl bg-pink-50 p-6 text-center">
                          <div className="text-5xl">🎧</div>
                          <p className="mt-3 font-bold text-gray-800">
                            Accessories
                          </p>
                        </div>

                      </div>

                      <button
                        onClick={() => navigate("/products")}
                        className="mt-5 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-700"
                      >
                        Explore Products
                      </button>

                    </div>
                  </div>

                  {/* Floating Card */}
                  <div className="absolute -bottom-6 -left-8 rounded-2xl bg-white px-5 py-4 shadow-xl">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl">
                        ✓
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Shopping made
                        </p>

                        <p className="font-bold text-gray-900">
                          Simple & Secure
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ================= FEATURES ================= */}
        <section className="border-b bg-gray-50">

          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                    {feature.icon}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {feature.description}
                  </p>

                </div>
              ))}

            </div>
          </div>
        </section>


        {/* ================= CATEGORIES ================= */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <div className="mb-10 text-center">

              <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Shop by Category
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                Explore different categories and discover products
                that match your needs.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => navigate("/products")}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >

                  <div className="flex items-center gap-5">

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-3xl transition group-hover:bg-indigo-100">
                      {category.icon}
                    </div>

                    <div>

                      <h3 className="text-lg font-bold text-gray-900">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {category.description}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-indigo-600">
                        Explore →
                      </p>

                    </div>

                  </div>

                </button>
              ))}

            </div>
          </div>
        </section>


        {/* ================= WHY CHOOSE US ================= */}
        <section className="bg-gray-950 px-4 py-20 text-white sm:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <div className="grid items-center gap-12 lg:grid-cols-2">

              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-indigo-300">
                  Why MultiShop?
                </p>

                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  Built for a better shopping experience.
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-gray-400">
                  MultiShop brings customers and sellers together
                  on one easy-to-use platform. Discover products,
                  compare options, add items to your wishlist,
                  and checkout securely.
                </p>

                <div className="mt-8 space-y-5">

                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                      ✓
                    </div>

                    <div>

                      <h3 className="font-bold">
                        Multiple Sellers
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Discover products from different sellers
                        in one convenient marketplace.
                      </p>

                    </div>

                  </div>


                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                      ✓
                    </div>

                    <div>

                      <h3 className="font-bold">
                        Secure & Reliable
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Secure authentication, protected payments,
                        and reliable order management.
                      </p>

                    </div>

                  </div>


                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                      ✓
                    </div>

                    <div>

                      <h3 className="font-bold">
                        Easy Order Tracking
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Track your orders from placement to
                        delivery with a simple interface.
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* Stats */}
              <div className="grid grid-cols-2 gap-5">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-7">

                  <p className="text-4xl font-extrabold text-indigo-300">
                    100%
                  </p>

                  <p className="mt-2 font-semibold">
                    Secure Checkout
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Safe payment experience
                  </p>

                </div>


                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-7">

                  <p className="text-4xl font-extrabold text-indigo-300">
                    24/7
                  </p>

                  <p className="mt-2 font-semibold">
                    Online Shopping
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Shop whenever you want
                  </p>

                </div>


                <div className="-mt-8 rounded-2xl border border-white/10 bg-white/5 p-7">

                  <p className="text-4xl font-extrabold text-indigo-300">
                    100+
                  </p>

                  <p className="mt-2 font-semibold">
                    Product Choices
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Products across categories
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/5 p-7">

                  <p className="text-4xl font-extrabold text-indigo-300">
                    Easy
                  </p>

                  <p className="mt-2 font-semibold">
                    Order Management
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Simple and convenient shopping
                  </p>

                </div>

              </div>

            </div>
          </div>
        </section>


        {/* ================= FINAL CTA ================= */}
        <section className="border-t bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl">

            <h2 className="text-3xl font-extrabold text-gray-900">
              Ready to start shopping?
            </h2>

            <p className="mt-3 text-gray-500">
              Discover products, save your favorites, and enjoy
              a simple shopping experience.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-7 rounded-xl bg-indigo-600 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-indigo-700"
            >
              Explore Products
            </button>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Home;
