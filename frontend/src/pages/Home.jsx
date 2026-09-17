import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  // =========================================
  // HERO CAROUSEL
  // =========================================

  const carouselImages = [
    {
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=90",
      badge: "WELCOME TO MULTISHOP",
      title: "Shop Everything You Need",
      subtitle:
        "Discover products from trusted sellers and enjoy a simple shopping experience.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=2000&q=90",
      badge: "EXPLORE MORE",
      title: "Discover Great Products",
      subtitle:
        "Explore a wide range of products across multiple categories.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2000&q=90",
      badge: "SHOP WITH CONFIDENCE",
      title: "Simple & Secure Shopping",
      subtitle:
        "Enjoy a smooth checkout experience with secure payment processing.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=2000&q=90",
      badge: "FASHION",
      title: "Refresh Your Style",
      subtitle:
        "Find fashion and lifestyle essentials for your everyday needs.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=2000&q=90",
      badge: "SMART SHOPPING",
      title: "Find What Fits You",
      subtitle:
        "Discover products that match your lifestyle and preferences.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2000&q=90",
      badge: "TECHNOLOGY",
      title: "Upgrade Your Technology",
      subtitle:
        "Explore electronics, gadgets and everyday technology.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=2000&q=90",
      badge: "HOME & LIVING",
      title: "Make Your Home Better",
      subtitle:
        "Discover useful products for your home and everyday life.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=2000&q=90",
      badge: "QUALITY & CONVENIENCE",
      title: "Shopping Made Easy",
      subtitle:
        "Browse, choose and order with a simple shopping experience.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2000&q=90",
      badge: "SPORTS",
      title: "Move With Confidence",
      subtitle:
        "Explore sports, fitness and footwear essentials.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2000&q=90",
      badge: "YOUR STYLE",
      title: "Fashion For Everyone",
      subtitle:
        "Discover clothing and accessories for every occasion.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2000&q=90",
      badge: "BEAUTY & CARE",
      title: "Take Care of Yourself",
      subtitle:
        "Explore beauty and personal care products.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=2000&q=90",
      badge: "MULTISHOP",
      title: "Your Shopping Journey Starts Here",
      subtitle:
        "Find products, discover sellers and shop with confidence.",
    },
  ];

  // =========================================
  // AUTO CAROUSEL
  // =========================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((previous) =>
        previous === carouselImages.length - 1
          ? 0
          : previous + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // =========================================
  // CATEGORIES
  // =========================================

  const categories = [
    {
      name: "Electronics",
      icon: "💻",
      description: "Devices & gadgets",
      path: "/products",
    },
    {
      name: "Fashion",
      icon: "👕",
      description: "Clothing & lifestyle",
      path: "/products",
    },
    {
      name: "Shoes",
      icon: "👟",
      description: "Footwear & sneakers",
      path: "/products",
    },
    {
      name: "Home",
      icon: "🏠",
      description: "Home essentials",
      path: "/products",
    },
    {
      name: "Beauty",
      icon: "💄",
      description: "Beauty & care",
      path: "/products",
    },
    {
      name: "Sports",
      icon: "⚽",
      description: "Sports & fitness",
      path: "/products",
    },
  ];

  // =========================================
  // SHOPPING BENEFITS
  // =========================================

  const benefits = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description:
        "Get your orders delivered quickly and conveniently.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description:
        "Your checkout experience is protected with secure payments.",
    },
    {
      icon: "🏪",
      title: "Trusted Sellers",
      description:
        "Discover products from sellers using our marketplace.",
    },
    {
      icon: "↩️",
      title: "Easy Shopping",
      description:
        "Browse, order and manage your purchases with ease.",
    },
  ];

  // =========================================
  // HOW IT WORKS
  // =========================================

  const steps = [
    {
      number: "01",
      icon: "🔎",
      title: "Find Products",
      description:
        "Search for products or explore different categories.",
    },
    {
      number: "02",
      icon: "🛒",
      title: "Add to Cart",
      description:
        "Select the products you want and add them to your cart.",
    },
    {
      number: "03",
      icon: "💳",
      title: "Secure Checkout",
      description:
        "Review your order and complete the secure payment.",
    },
    {
      number: "04",
      icon: "📦",
      title: "Receive Order",
      description:
        "Track your order and receive it at your doorstep.",
    },
  ];

  // =========================================
  // WHY MULTISHOP
  // =========================================

  const whyMultiShop = [
    {
      icon: "🛍️",
      title: "Multiple Categories",
      text: "Explore different categories from one convenient marketplace.",
    },
    {
      icon: "🔐",
      title: "Secure Experience",
      text: "Built with authentication and secure payment processing.",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      text: "Enjoy a smooth experience across desktop, tablet and mobile.",
    },
    {
      icon: "⚡",
      title: "Simple Interface",
      text: "Clean navigation makes it easy to find what you need.",
    },
  ];

  // =========================================
  // FAQ
  // =========================================

  const faqs = [
    {
      question: "How can I shop on MultiShop?",
      answer:
        "Browse products through the Products page, choose the items you want, add them to your cart and complete checkout.",
    },
    {
      question: "How can I search for a product?",
      answer:
        "Use the search bar on the homepage or Products page to search for products by name or keyword.",
    },
    {
      question: "How can I become a seller?",
      answer:
        "Use the seller contact option to contact the administrator and start the seller request process.",
    },
    {
      question: "Are payments secure?",
      answer:
        "MultiShop is designed to use secure payment processing during checkout.",
    },
    {
      question: "Can I track my orders?",
      answer:
        "After placing an order, you can use the Orders section to view your order information and status.",
    },
  ];

  // =========================================
  // SEARCH
  // =========================================

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (value) {
      navigate(
        `/products?search=${encodeURIComponent(value)}`
      );
    } else {
      navigate("/products");
    }
  };

  // =========================================
  // FAQ TOGGLE
  // =========================================

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar />

      {/* =========================================
          HERO CAROUSEL
      ========================================= */}

      <section className="relative overflow-hidden bg-gray-950">
        <div className="relative h-[450px] sm:h-[520px] lg:h-[600px]">
          {carouselImages.map((slide, index) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/55" />

              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />

              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest text-white backdrop-blur-md sm:text-sm">
                      {slide.badge}
                    </span>

                    <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                      {slide.subtitle}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="rounded-xl bg-white px-40 py-3.5 font-semibold text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:bg-gray-100"
                      >
                        Explore Products
                      </button>

                      {/* <button
                        type="button"
                        onClick={() =>
                          navigate("/contact-admin")
                        }
                        className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                      >
                        Become a Seller
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Indicators */}
          <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
            {carouselImages.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SEARCH BAR
      ========================================= */}

      <section className="relative z-20 -mt-8 px-4">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2.5 shadow-2xl sm:flex-row dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex flex-1 items-center gap-3 px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5 shrink-0 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, categories..."
                className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* =========================================
          SHOPPING BENEFITS
      ========================================= */}

      <section className="bg-white pt-14 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-2xl border border-gray-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl transition group-hover:scale-110 dark:bg-indigo-900/30">
                {benefit.icon}
              </div>

              <h3 className="mt-5 font-bold text-gray-900 dark:text-white">
                {benefit.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          POPULAR CATEGORIES
      ========================================= */}

      <section className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Explore
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Popular Categories
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
              Explore categories and quickly find what you are
              looking for.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => navigate(category.path)}
                className="group rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-600"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl transition duration-300 group-hover:scale-110 group-hover:bg-indigo-100 dark:bg-gray-800 dark:group-hover:bg-indigo-900/40">
                  {category.icon}
                </div>

                <h3 className="mt-5 font-bold text-gray-900 dark:text-white">
                  {category.name}
                </h3>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {category.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SPECIAL OFFER BANNER
      ========================================= */}

      <section className="bg-white py-10 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-7 py-12 sm:px-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
              <div className="text-center lg:text-left">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest text-white backdrop-blur-md">
                  SPECIAL OFFERS
                </span>

                <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                  Discover More. Shop Smarter.
                </h2>

                <p className="mt-4 max-w-xl text-white/80">
                  Explore the marketplace and discover products
                  across different categories.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="shrink-0 rounded-xl bg-white px-8 py-4 font-bold text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:bg-gray-100"
              >
                Explore Deals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS
      ========================================= */}

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              How MultiShop Works
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
              Shopping is simple from product discovery to delivery.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group rounded-2xl border border-gray-200 bg-gray-50 p-7 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-2xl dark:bg-indigo-900/30">
                    {step.icon}
                  </div>

                  <span className="text-4xl font-black text-gray-200 dark:text-gray-800">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          WHY MULTISHOP
      ========================================= */}

      <section className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Why MultiShop
              </span>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Everything You Need in One Marketplace
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-gray-500 dark:text-gray-400">
                MultiShop provides a clean marketplace experience
                where customers can explore products and sellers can
                manage their businesses.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-7 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
              >
                Start Shopping
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {whyMultiShop.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl dark:bg-indigo-900/30">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SELLER CTA
      ========================================= */}

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gray-900 px-7 py-14 dark:bg-gray-800 sm:px-12 lg:px-16">
            <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">
                  FOR SELLERS
                </span>

                <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                  Have Products to Sell?
                </h2>

                <p className="mt-4 leading-7 text-gray-400">
                  Join MultiShop and showcase your products through
                  our multi-vendor marketplace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/contact-admin")}
                className="shrink-0 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-indigo-700"
              >
                Become a Seller
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FAQ
      ========================================= */}

      <section className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Help Center
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
              Find answers to some common questions about MultiShop.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-600 transition-transform dark:bg-gray-800 dark:text-gray-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          NEWSLETTER
      ========================================= */}

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl dark:bg-indigo-900/30">
            ✉️
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Stay Updated
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400">
            Get updates about new products, marketplace announcements
            and special offers.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900"
            />

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white transition hover:bg-indigo-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl dark:bg-indigo-900/30">
            🛍️
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Ready to Start Shopping?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-500 dark:text-gray-400">
            Explore categories, discover products and enjoy a simple
            marketplace experience with MultiShop.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="rounded-xl bg-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
            >
              Explore Products
            </button>

            <button
              type="button"
              onClick={() => navigate("/contact-admin")}
              className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 font-semibold text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Contact Admin
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          FOOTER
      ========================================= */}

      <Footer />
    </div>
  );
}

export default Home;