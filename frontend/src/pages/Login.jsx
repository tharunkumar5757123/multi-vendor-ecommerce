import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import { loginSuccess } from "../redux/slices/authSlice";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
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
      const response = await toast.promise(
        api.post("/auth/login", formData),
        {
          loading: "Logging in...",
          success: "Logged in successfully",
          error: (error) =>
            error.response?.data?.message ||
            error.message ||
            "Login failed",
        },
        {
          loading: { icon: "⏳" },
          success: { icon: "✅" },
          error: { icon: "❌" },
        }
      );

      console.log("LOGIN SUCCESS:", response.data);

      const user = response.data.user;
      const token = response.data.token;

      const normalizedUser = {
        ...user,
        role: user.role.toLowerCase(),
      };

      dispatch(
        loginSuccess({
          user: normalizedUser,
          token,
        })
      );

      if (normalizedUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (normalizedUser.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      console.error("LOGIN RESPONSE:", error.response);
      console.error("LOGIN DATA:", error.response?.data);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
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

        {/* ================= LOGIN AREA ================= */}
        <div className="relative z-10 flex min-h-[calc(100vh-7rem)] items-center justify-center">
          <div className="w-full max-w-sm">

            {/* ================= BRAND ================= */}
            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-xl shadow-xl shadow-indigo-500/20 backdrop-blur-xl">
                🛍️
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Welcome back
              </h1>

              <p className="mt-1.5 text-xs text-slate-400">
                Sign in to continue to{" "}
                <span className="font-semibold text-indigo-400">
                  ShopBasket
                </span>
              </p>
            </div>

            {/* ================= GLASS CARD ================= */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7">

              {/* Card Glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

              <div className="relative">

                {/* ================= ERROR ================= */}
                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* ================= FORM ================= */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-medium text-slate-200"
                    >
                      Email address
                    </label>

                    <div className="group relative">
                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-indigo-400">
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
                            d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-indigo-400">
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
                            d="M16 10V8a4 4 0 00-8 0v2m-2 0h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z"
                          />
                        </svg>
                      </div>

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.07] py-3 pl-10 pr-10 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-indigo-500/10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
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
                              d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.94 9.94 0 0112 4.5c5 0 8.5 5.5 8.5 5.5a17.14 17.14 0 01-3.13 3.84M6.1 6.1C3.88 7.61 2.5 10 2.5 10S6 15.5 12 15.5c.78 0 1.53-.08 2.24-.23"
                            />
                          </svg>
                        ) : (
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
                              d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12z"
                            />

                            <circle cx="12" cy="12" r="2.5" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-1 w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login
                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </>
                      )}
                    </span>

                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </form>

                {/* ================= DIVIDER ================= */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-[10px] text-slate-500">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* ================= REGISTER ================= */}
                <p className="text-center text-xs text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-indigo-400 transition hover:text-indigo-300 hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <p className="mt-4 text-center text-[10px] text-slate-600">
              Secure authentication powered by ShopBasket
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;