
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

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
      const response = await api.post("/auth/login", formData);

      console.log("LOGIN SUCCESS:", response.data);

      const user = response.data.user;
      const token = response.data.token;

      // Make sure role is lowercase
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

      // Redirect based on role
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Login
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to your account
        </p>

        {/* Error */}
        {error && (
          <div className="mt-5 bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
