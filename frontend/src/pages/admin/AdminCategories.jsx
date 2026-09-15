
import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  showConfirmToast,
  showToast,
} from "../../utils/showToast";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/categories/admin/all"
      );

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Categories error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });

    setEditingCategory(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast(
        "warning",
        "Category name required",
        "Category name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingCategory) {
        const response = await api.put(
          `/categories/${editingCategory._id}`,
          {
            name: formData.name.trim(),
            description: formData.description,
            image: formData.image,
          }
        );

        const updatedCategory =
          response.data.category;

        setCategories((previousCategories) =>
          previousCategories.map((category) =>
            category._id === editingCategory._id
              ? updatedCategory
              : category
          )
        );
      } else {
        const response = await api.post(
          "/categories",
          {
            name: formData.name.trim(),
            description: formData.description,
            image: formData.image,
          }
        );

        setCategories((previousCategories) => [
          response.data.category,
          ...previousCategories,
        ]);
      }

      resetForm();
    } catch (error) {
      console.error("Category save error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save category"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
    });

    setShowForm(true);
  };

  const handleStatusChange = async (
    categoryId,
    currentStatus
  ) => {
    try {
      setUpdatingId(categoryId);

      const response = await api.put(
        `/categories/${categoryId}/status`,
        {
          isActive: !currentStatus,
        }
      );

      const updatedCategory =
        response.data.category;

      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category._id === categoryId
            ? updatedCategory
            : category
        )
      );
    } catch (error) {
      console.error(
        "Category status error:",
        error
      );

      showToast(
        "error",
        "Status update failed",
        error.response?.data?.message ||
          "Failed to update category status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (
    categoryId,
    categoryName
  ) => {
    const confirmed = await showConfirmToast({
      title: "Delete category?",
      message: `"${categoryName}" will be permanently deleted.`,
      confirmText: "Delete",
    });

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(categoryId);

      await api.delete(
        `/categories/${categoryId}`
      );

      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) =>
            category._id !== categoryId
        )
      );

      showToast(
        "success",
        "Category deleted",
        "Category deleted successfully."
      );
    } catch (error) {
      console.error(
        "Category delete error:",
        error
      );

      showToast(
        "error",
        "Delete failed",
        error.response?.data?.message ||
          "Failed to delete category"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter(
    (category) => {
      const searchText = search.toLowerCase();

      return (
        category.name
          ?.toLowerCase()
          .includes(searchText) ||
        category.description
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories =
    categories.filter(
      (category) => !category.isActive
    ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Category Management
            </h1>

            <p className="text-gray-600 mt-2">
              Manage product categories for your marketplace.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-gray-800 text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-700"
          >
            + Add Category
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Total Categories
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {totalCategories}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Active Categories
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {activeCategories}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Inactive Categories
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {inactiveCategories}
            </h2>
          </div>

        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter category information below.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Electronics"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter category description..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Categories
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by category name or description..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
          />

        </div>

        {/* Category List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">

          <div className="p-5 border-b border-gray-200">

            <h2 className="text-xl font-semibold text-gray-800">
              All Categories
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredCategories.length} of{" "}
              {totalCategories} categories
            </p>

          </div>

          {loading ? (
            <div className="py-16 text-center">

              <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>

              <p className="text-gray-500 mt-4">
                Loading categories...
              </p>

            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 text-center">

              <p className="text-gray-500">
                No categories found.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Category
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Description
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Created
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredCategories.map(
                    (category) => (
                      <tr
                        key={category._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >

                        {/* Category */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3 min-w-[220px]">

                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                📁
                              </div>
                            )}

                            <p className="font-medium text-gray-800">
                              {category.name}
                            </p>

                          </div>

                        </td>

                        {/* Description */}
                        <td className="px-5 py-4 text-gray-600 max-w-[350px]">
                          <p className="truncate">
                            {category.description ||
                              "No description"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              category.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {category.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>

                        {/* Created */}
                        <td className="px-5 py-4 text-gray-600">
                          {category.createdAt
                            ? new Date(
                                category.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">

                          <div className="flex flex-wrap gap-2">

                            <button
                              onClick={() =>
                                handleEdit(category)
                              }
                              disabled={
                                updatingId ===
                                  category._id ||
                                deletingId ===
                                  category._id
                              }
                              className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleStatusChange(
                                  category._id,
                                  category.isActive
                                )
                              }
                              disabled={
                                updatingId ===
                                  category._id ||
                                deletingId ===
                                  category._id
                              }
                              className={`px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50 ${
                                category.isActive
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              {updatingId ===
                              category._id
                                ? "Updating..."
                                : category.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  category._id,
                                  category.name
                                )
                              }
                              disabled={
                                deletingId ===
                                  category._id ||
                                updatingId ===
                                  category._id
                              }
                              className="px-3 py-2 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              {deletingId ===
                              category._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default AdminCategories;
