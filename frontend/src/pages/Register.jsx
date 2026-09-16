
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await toast.promise(
        api.post("/auth/register", formData),
        {
          loading: "Creating account...",
          success: "Account created successfully",
          error: (error) =>
            error.response?.data?.message ||
            "Registration failed",
        },
        {
          loading: {
            icon: "⏳",
          },
          success: {
            icon: "✅",
          },
          error: {
            icon: "❌",
          },
        }
      );

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 px-4 py-6 sm:px-6">

        {/* ================= BACKGROUND ================= */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />

          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-purple-600/25 blur-3xl" />

          <div className="absolute bottom-[-150px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* ================= MAIN CARD ================= */}

        <div className="relative z-10 flex min-h-[calc(100vh-7rem)] items-center justify-center">

          <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-2">

            {/* ================================================= */}
            {/* LEFT IMAGE */}
            {/* ================================================= */}

            <div className="relative hidden min-h-[500px] overflow-hidden lg:block">

              {/* Background */}

              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" />

              {/* Glow */}

              <div className="absolute left-[-60px] top-[-60px] h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />

              <div className="absolute bottom-[-80px] right-[-60px] h-64 w-64 rounded-full bg-purple-500/25 blur-3xl" />

              {/* Image */}

              <img
                src="https://static.wixstatic.com/media/9c9586_5e1b45e54aa446eabba82e68ed12b8d7~mv2.jpg/v1/fill/w_560%2Ch_560%2Cal_c%2Cq_80%2Cenc_avif%2Cquality_auto/9c9586_5e1b45e54aa446eabba82e68ed12b8d7~mv2.jpg"
                alt="Online shopping"
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-indigo-950/20" />

              {/* Content */}

              <div className="relative z-10 flex h-full flex-col justify-between p-7">

                {/* Logo */}

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-xl backdrop-blur-xl">
                    🛍️
                  </div>

                  <div>
                    <p className="text-lg font-extrabold text-white">
                      ShopBasket
                    </p>

                    <p className="text-[10px] text-slate-300">
                      Multi-Vendor Marketplace
                    </p>
                  </div>

                </div>

                {/* Bottom Content */}

                <div>

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Your marketplace starts here
                  </div>

                  <h2 className="text-3xl font-extrabold leading-tight text-white">
                    Discover.
                    <br />
                    Shop.
                    <br />
                    Enjoy.
                  </h2>

                  <p className="mt-3 max-w-sm text-xs leading-5 text-slate-300">
                    Create your ShopBasket account and explore
                    products from multiple sellers in one place.
                  </p>

                  {/* Feature Cards */}

                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                      <div className="text-lg">🛒</div>

                      <p className="mt-1 text-xs font-semibold text-white">
                        Easy Shopping
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Simple & secure
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                      <div className="text-lg">🚚</div>

                      <p className="mt-1 text-xs font-semibold text-white">
                        Multiple Sellers
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        More choices
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* RIGHT REGISTER */}
            {/* ================================================= */}

            <div className="relative flex items-center justify-center p-6 sm:p-8">

              {/* Glow */}

              <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-52 w-52 rounded-full bg-indigo-500/15 blur-3xl" />

              <div className="relative w-full max-w-sm">

                {/* Mobile Logo */}

                <div className="mb-5 text-center lg:hidden">

                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-xl backdrop-blur-xl">
                    🛍️
                  </div>

                  <h1 className="text-2xl font-extrabold text-white">
                    ShopBasket
                  </h1>

                </div>

                {/* Heading */}

                <div className="mb-5">

                  <p className="mb-1.5 text-xs font-semibold tracking-wider text-indigo-400">
                    GET STARTED
                  </p>

                  <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    Create your account
                  </h1>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Join ShopBasket and start your shopping journey.
                  </p>

                </div>

                {/* Error */}

                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* ================= FORM ================= */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* NAME */}

                  <div>

                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-xs font-medium text-slate-200"
                    >
                      Full name
                    </label>

                    <div className="group relative">

                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400">

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 20.25a7.5 7.5 0 0115 0"
                          />
                        </svg>

                      </div>

                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        autoComplete="name"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.07] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-indigo-500/10"
                      />

                    </div>
                  </div>

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-medium text-slate-200"
                    >
                      Email address
                    </label>

                    <div className="group relative">

                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400">

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l9 6 9-6"
                          />

                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2"
                          />
                        </svg>

                      </div>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.07] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-indigo-500/10"
                      />

                    </div>
                  </div>

                  {/* PASSWORD */}

                  <div>

                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-xs font-medium text-slate-200"
                    >
                      Password
                    </label>

                    <div className="group relative">

                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400">

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 10V8a4 4 0 00-8 0v2"
                          />

                          <rect
                            x="4"
                            y="10"
                            width="16"
                            height="11"
                            rx="2"
                          />
                        </svg>

                      </div>

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.07] py-3 pl-10 pr-10 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-indigo-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition hover:text-white"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>

                    </div>

                    <p className="mt-1.5 text-[10px] text-slate-500">
                      Password must contain at least 6 characters.
                    </p>

                  </div>

                  {/* REGISTER BUTTON */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-1 w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >

                    <span className="relative z-10 flex items-center justify-center gap-2">

                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Creating account...
                        </>
                      ) : (
                        <>
                          Create account

                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </>
                      )}

                    </span>

                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  </button>

                </form>

                {/* LOGIN */}

                <div className="mt-5 text-center">

                  <p className="text-xs text-slate-400">
                    Already have an account?{" "}

                    <Link
                      to="/login"
                      className="font-semibold text-indigo-400 transition hover:text-indigo-300 hover:underline"
                    >
                      Login
                    </Link>
                  </p>

                </div>

                {/* FOOTER */}

                <p className="mt-5 text-center text-[10px] text-slate-600">
                  Secure account creation powered by ShopBasket
                </p>

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default Register;
