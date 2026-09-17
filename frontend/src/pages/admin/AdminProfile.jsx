
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "../../services/api";
import { loginSuccess } from "../../redux/slices/authSlice";
import { showToast } from "../../utils/showToast";

function AdminProfile() {
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

  // ==============================
  // Profile Input
  // ==============================

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // Profile Image
  // ==============================

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");

    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const triggerProfileImageInput = () => {
    document.getElementById("admin-profile-image-input")?.click();
  };

  // ==============================
  // Update Profile
  // ==============================

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

      const response = await api.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data.user || response.data;

      if (updatedUser) {
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
      }

      setSuccess("Profile updated successfully.");

      showToast(
        "success",
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error("Profile update error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update profile";

      setError(message);

      showToast(
        "error",
        "Update Failed",
        message
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ==============================
  // Password Input
  // ==============================

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // Password Visibility
  // ==============================

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ==============================
  // Change Password
  // ==============================

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

      await api.put("/users/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Password changed successfully.");

      showToast(
        "success",
        "Password Changed",
        "Your password has been changed successfully."
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to change password";

      setError(message);

      showToast(
        "error",
        "Password Change Failed",
        message
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950">

      {/* Header */}
      <section className="bg-gray-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="mb-2 text-sm font-medium text-indigo-300">
            ADMIN ACCOUNT
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-gray-300">
            Manage your personal information and
            account security.
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">

        {/* Messages */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl bg-green-50 px-5 py-4 text-sm font-medium text-green-600 dark:bg-green-950/30 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Profile + Password */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ==============================
              PROFILE CARD
          ============================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">

            {/* Profile Header */}

            <div className="mb-6 text-center">

              <div className="relative mx-auto h-24 w-24">

                {/* Profile Image */}

                <button
                  type="button"
                  onClick={triggerProfileImageInput}
                  className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600 ring-4 ring-white transition hover:ring-indigo-100 dark:bg-indigo-900/30 dark:ring-gray-900"
                  aria-label="Change profile image"
                  title="Change profile image"
                >

                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt={user?.name || "Admin"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "A"
                  )}

                </button>

                {/* Add Image Button */}

                <button
                  type="button"
                  onClick={triggerProfileImageInput}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-xl font-bold leading-none text-white shadow-md transition hover:bg-indigo-700"
                  aria-label="Add profile image"
                  title="Change profile image"
                >
                  +
                </button>

                <input
                  id="admin-profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />

              </div>

              {/* Name */}

              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {user?.name || "Admin"}
              </h2>

              {/* Email */}

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>

              {/* Role */}

              <span className="mt-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold capitalize text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {user?.role || "admin"}
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                />

              </div>

              {/* Phone */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

              </div>

              {/* Role */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Role
                </label>

                <input
                  type="text"
                  value={user?.role || "admin"}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 capitalize text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                />

              </div>

              {/* Update Button */}

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {profileLoading
                  ? "Updating..."
                  : "Update Profile"}
              </button>

            </form>

          </div>

          {/* ==============================
              CHANGE PASSWORD
          ============================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 lg:col-span-2">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your admin account password
                to keep your account secure.
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(
                        "currentPassword"
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600"
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
                    value={
                      passwordForm.newPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(
                        "newPassword"
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600"
                  >
                    {showPasswords.newPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 6 characters.
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(
                        "confirmPassword"
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600"
                  >
                    {showPasswords.confirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* Change Password Button */}

              <button
                type="submit"
                disabled={passwordLoading}
                className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                {passwordLoading
                  ? "Changing Password..."
                  : "Change Password"}
              </button>

            </form>

          </div>

        </div>
      </section>
    </main>
  );
}

export default AdminProfile;
