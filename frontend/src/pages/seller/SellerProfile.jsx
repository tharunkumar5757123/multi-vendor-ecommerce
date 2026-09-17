import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loginSuccess } from "../../redux/slices/authSlice";
import api from "../../services/api";

function SellerProfile() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.profileImage || ""
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // ============================
  // Profile Change
  // ============================

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // Image Change
  // ============================

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setSuccess("");

    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  // ============================
  // Update Profile
  // ============================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setProfileLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("name", profileForm.name);
      formData.append("phone", profileForm.phone);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await api.put(
        "/users/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser =
        response.data.user || response.data;

      const normalizedUser = {
        ...updatedUser,
        role: updatedUser.role?.toLowerCase(),
      };

      dispatch(
        loginSuccess({
          user: normalizedUser,
          token: token || localStorage.getItem("token"),
        })
      );

      setProfileImage(null);

      setProfileImagePreview(
        normalizedUser.profileImage || ""
      );

      setProfileForm({
        name: normalizedUser.name || "",
        phone: normalizedUser.phone || "",
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("SELLER PROFILE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ============================
  // Password Change
  // ============================

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // Show / Hide Password
  // ============================

  const togglePassword = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  // ============================
  // Change Password
  // ============================

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("All password fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);

      await api.put(
        "/users/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Password changed successfully.");
    } catch (err) {
      console.error("PASSWORD ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">

      {/* Page Header */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Seller Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your seller account and security
        </p>
      </div>

      {/* Messages */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ============================
            PROFILE CARD
        ============================ */}

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">

          {/* Profile Header */}

          <div className="mb-6 text-center">

            <div className="relative mx-auto h-24 w-24">

              <label
                htmlFor="seller-profile-image"
                className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-100 text-3xl font-bold text-blue-600 ring-4 ring-blue-50 dark:bg-blue-900/30 dark:ring-blue-900/20"
              >
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Seller"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "S"
                )}
              </label>

              <label
                htmlFor="seller-profile-image"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-lg font-bold text-white shadow-md hover:bg-blue-700 dark:border-gray-900"
              >
                +
              </label>

              <input
                id="seller-profile-image"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />

            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              {user?.name || "Seller"}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>

            <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {user?.role || "seller"}
            </span>

          </div>

          {/* Profile Form */}

          <form
            onSubmit={handleProfileSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </label>

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Update Button */}

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {profileLoading
                ? "Updating..."
                : "Update Profile"}
            </button>

          </form>
        </div>

        {/* ============================
            PASSWORD CARD
        ============================ */}

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 lg:col-span-2">

          <div className="mb-7">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Account Security
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Change your password to keep your seller
              account secure.
            </p>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="max-w-2xl space-y-5"
          >

            {/* Current Password */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Current Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPasswords.currentPassword
                      ? "text"
                      : "password"
                  }
                  name="currentPassword"
                  value={
                    passwordForm.currentPassword
                  }
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePassword(
                      "currentPassword"
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showPasswords.currentPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>
            </div>

            {/* New Password */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                New Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPasswords.newPassword
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePassword("newPassword")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showPasswords.newPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Password must contain at least 6
                characters.
              </p>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPasswords.confirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    passwordForm.confirmPassword
                  }
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePassword(
                      "confirmPassword"
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showPasswords.confirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>
            </div>

            {/* Password Button */}

            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {passwordLoading
                ? "Changing Password..."
                : "Change Password"}
            </button>

          </form>

          {/* Security Information */}

          <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">

            <div className="flex gap-3">

              <div className="text-xl">
                🔐
              </div>

              <div>
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-400">
                  Keep your account secure
                </h3>

                <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-400">
                  Use a strong password and never share
                  your seller account credentials with
                  anyone.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Account Information */}

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Account Information
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              Account Type
            </p>

            <p className="mt-2 text-lg font-bold capitalize text-gray-900 dark:text-white">
              {user?.role || "seller"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              Account Status
            </p>

            <p className="mt-2 text-lg font-bold text-green-600">
              Active
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
              Email
            </p>

            <p className="mt-2 truncate text-sm font-bold text-gray-900 dark:text-white">
              {user?.email || "Not available"}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default SellerProfile;