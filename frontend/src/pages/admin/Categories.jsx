import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/categories/admin/all");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("CATEGORIES ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (!formData.name.trim()) {
        setError("Category name is required");
        return;
      }

      if (editingCategory) {
        await api.put(
          `/categories/${editingCategory._id}`,
          formData
        );
      } else {
        await api.post("/categories", formData);
      }

      setFormData({
        name: "",
        description: "",
        image: "",
      });

      setEditingCategory(null);
      setShowForm(false);

      fetchCategories();
    } catch (error) {
      console.error("CATEGORY SAVE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save category"
      );
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

    setError("");
  };

  const handleStatusChange = async (category) => {
    try {
      const response = await api.put(
        `/categories/${category._id}/status`,
        {
          isActive: !category.isActive,
        }
      );

      setCategories((previousCategories) =>
        previousCategories.map((item) =>
          item._id === category._id
            ? response.data.category
            : item
        )
      );
    } catch (error) {
      console.error(
        "CATEGORY STATUS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update category status"
      );
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);

      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) => category._id !== categoryId
        )
      );
    } catch (error) {
      console.error(
        "CATEGORY DELETE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);

    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      image: "",
    });

    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading categories...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Category Management
            </h1>

            <p className="text-gray-600 mt-2">
              Create and manage product categories
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingCategory(null);

              setFormData({
                name: "",
                description: "",
                image: "",
              });
            }}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            + Add Category
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow mt-8 p-6">

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {editingCategory
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder="Enter image URL"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >
                  {editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>

              </div>
            </form>
          </div>
        )}

        {/* Categories table */}
        <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-50">

                <tr>
                  <th className="px-6 py-4">
                    Category
                  </th>

                  <th className="px-6 py-4">
                    Description
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-t hover:bg-gray-50"
                    >

                      {/* Category */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                              No
                            </div>
                          )}

                          <p className="font-semibold text-gray-800">
                            {category.name}
                          </p>

                        </div>

                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-gray-600 max-w-md">
                        {category.description || "No description"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
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

                      {/* Actions */}
                      <td className="px-6 py-4">

                        <div className="flex gap-2 flex-wrap">

                          <button
                            onClick={() =>
                              handleEdit(category)
                            }
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(category)
                            }
                            className={
                              category.isActive
                                ? "bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                                : "bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                            }
                          >
                            {category.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(category._id)
                            }
                            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Categories;