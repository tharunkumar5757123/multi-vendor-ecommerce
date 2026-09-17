import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ContactAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessCategory: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.businessName ||
      !formData.businessCategory ||
      !formData.reason
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/seller-requests", formData);

      setMessage(
        response.data?.message ||
          "Your seller request has been submitted successfully."
      );

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        businessName: "",
        businessCategory: "",
        reason: "",
      });
    } catch (err) {
      console.error("SELLER REQUEST ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit seller request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="mb-6 text-sm text-indigo-400 transition hover:text-indigo-300"
          >
            ← Back to ShopBasket
          </button>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Become a Seller
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Interested in selling your products on ShopBasket? Submit your
            details below and our admin team will review your request.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Information Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl">
              🏪
            </div>

            <h2 className="text-2xl font-semibold">
              Sell with ShopBasket
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Grow your business by reaching customers through our
              multi-vendor marketplace.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <div className="text-xl">📝</div>
                <div>
                  <h3 className="font-medium">Submit your request</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Tell us about yourself and your business.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-xl">🔍</div>
                <div>
                  <h3 className="font-medium">Admin review</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Our admin team will review your seller application.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-xl">🚀</div>
                <div>
                  <h3 className="font-medium">Start selling</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Once approved, you can start managing your products.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h2 className="text-xl font-semibold">
              Seller Request Form
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Please provide accurate information.
            </p>

            {message && (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              {/* Email + Phone */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Business Name + Category */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Business Name
                  </label>

                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your business name"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Business Category
                  </label>

                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                  >
                    <option value="" className="bg-slate-900">
                      Select category
                    </option>
                    <option value="Fashion" className="bg-slate-900">
                      Fashion
                    </option>
                    <option value="Electronics" className="bg-slate-900">
                      Electronics
                    </option>
                    <option value="Beauty" className="bg-slate-900">
                      Beauty
                    </option>
                    <option value="Home & Kitchen" className="bg-slate-900">
                      Home & Kitchen
                    </option>
                    <option value="Sports" className="bg-slate-900">
                      Sports
                    </option>
                    <option value="Food" className="bg-slate-900">
                      Food
                    </option>
                    <option value="Other" className="bg-slate-900">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Why do you want to become a seller?
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us briefly about your products and business..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting Request..." : "Submit Seller Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;