import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import AddressForm from "../components/AddressForm";

import api from "../services/api";
import { loginSuccess } from "../redux/slices/authSlice";

function Profile() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] =
    useState(false);
  const [addressLoading, setAddressLoading] =
    useState(false);
  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState(null);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] =
    useState({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses");

      const data =
        response.data.addresses ||
        response.data ||
        [];

      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Address fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load addresses"
      );
    }
  };

  // Initial load
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        await fetchAddresses();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Profile input
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  // Update profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setProfileLoading(true);
      setError("");
      setSuccess("");

      const response = await api.put("/users/profile", {
        name: profileForm.name,
        phone: profileForm.phone,
      });

      const updatedUser =
        response.data.user ||
        response.data;

      if (updatedUser) {
        dispatch(loginSuccess(updatedUser));

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Password input
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Change password
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
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Add address
  const handleAddAddress = async (formData) => {
    try {
      setAddressLoading(true);
      setError("");
      setSuccess("");

      await api.post("/addresses", formData);

      setShowAddressForm(false);

      await fetchAddresses();

      setSuccess("Address added successfully.");
    } catch (error) {
      console.error("Add address error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add address"
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // Edit address
  const handleEditAddress = async (formData) => {
    if (!editingAddress?._id) return;

    try {
      setAddressLoading(true);
      setError("");
      setSuccess("");

      await api.put(
        `/addresses/${editingAddress._id}`,
        formData
      );

      setEditingAddress(null);

      await fetchAddresses();

      setSuccess("Address updated successfully.");
    } catch (error) {
      console.error("Update address error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update address"
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/addresses/${id}`);

      setAddresses((prev) =>
        prev.filter(
          (address) => address._id !== id
        )
      );

      setSuccess("Address deleted successfully.");
    } catch (error) {
      console.error("Delete address error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete address"
      );
    }
  };

  // Set default address
  const handleSetDefault = async (id) => {
    try {
      setError("");
      setSuccess("");

      await api.put(`/addresses/${id}/default`);

      await fetchAddresses();

      setSuccess("Default address updated.");
    } catch (error) {
      console.error(
        "Set default address error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to set default address"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader />
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gray-900 px-4 py-10 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-sm font-medium text-indigo-300">
              MY ACCOUNT
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-gray-300">
              Manage your personal information,
              password and delivery addresses.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          {/* Messages */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl bg-green-50 px-5 py-4 text-sm font-medium text-green-600">
              {success}
            </div>
          )}

          {/* Profile + Password */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {user?.name || "User"}
                </h2>

                <p className="text-sm text-gray-500">
                  {user?.email}
                </p>

                <span className="mt-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {user?.role || "customer"}
                </span>
              </div>

              <form
                onSubmit={handleProfileSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

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

            {/* Change Password */}
            <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your account password to keep
                  your account secure.
                </p>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="max-w-2xl space-y-5"
              >
                {/* Current Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-indigo-500"
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
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-indigo-500"
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

                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 6 characters.
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-indigo-500"
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

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {passwordLoading
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </form>
            </div>
          </div>

          {/* Addresses */}
          <div className="mt-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  My Addresses
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your delivery addresses.
                </p>
              </div>

              {!showAddressForm &&
                !editingAddress && (
                  <button
                    onClick={() =>
                      setShowAddressForm(true)
                    }
                    className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    + Add Address
                  </button>
                )}
            </div>

            {/* Add Address */}
            {showAddressForm && (
              <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Add New Address
                  </h3>

                  <button
                    onClick={() =>
                      setShowAddressForm(false)
                    }
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>

                <AddressForm
                  onSubmit={handleAddAddress}
                  onCancel={() =>
                    setShowAddressForm(false)
                  }
                  loading={addressLoading}
                />
              </div>
            )}

            {/* Edit Address */}
            {editingAddress && (
              <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Edit Address
                  </h3>

                  <button
                    onClick={() =>
                      setEditingAddress(null)
                    }
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>

                <AddressForm
                  initialData={editingAddress}
                  onSubmit={handleEditAddress}
                  onCancel={() =>
                    setEditingAddress(null)
                  }
                  loading={addressLoading}
                />
              </div>
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
              <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm">
                <div className="mb-4 text-6xl">
                  📍
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  No Addresses Found
                </h3>

                <p className="text-gray-500">
                  Add a delivery address to make checkout
                  faster.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl">
                        📍
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-gray-900">
                            {address.fullName}
                          </h3>

                          {address.isDefault && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-600">
                          {address.phone}
                        </p>

                        <div className="mt-3 text-sm leading-6 text-gray-600">
                          <p>
                            {address.addressLine1}
                          </p>

                          {address.addressLine2 && (
                            <p>
                              {address.addressLine2}
                            </p>
                          )}

                          <p>
                            {address.city},{" "}
                            {address.state}{" "}
                            {address.postalCode}
                          </p>

                          <p>{address.country}</p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              setEditingAddress(address)
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteAddress(
                                address._id
                              )
                            }
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>

                          {!address.isDefault && (
                            <button
                              onClick={() =>
                                handleSetDefault(
                                  address._id
                                )
                              }
                              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                              Set Default
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Profile;