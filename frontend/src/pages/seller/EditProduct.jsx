
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    brand: "",
    category: "",
    stock: "",
    sku: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch product and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] =
          await Promise.all([
            api.get(`/products/${id}`),
            api.get("/categories"),
          ]);

        const product = productResponse.data.product;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          discountPrice: product.discountPrice ?? "",
          brand: product.brand || "",
          category: product.category?._id || product.category || "",
          stock: product.stock ?? "",
          sku: product.sku || "",
        });

        setExistingImages(product.images || []);

        setCategories(
          categoryResponse.data.categories || []
        );
      } catch (error) {
        console.error("EDIT PRODUCT LOAD ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Handle text/select inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle new image selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const totalImages =
      existingImages.length + selectedFiles.length;

    if (totalImages > 5) {
      setError("You can have a maximum of 5 images.");
      return;
    }

    setError("");
    setNewImages(selectedFiles);
  };

  // Remove existing Cloudinary image
  const removeExistingImage = (publicId) => {
    setExistingImages((previousImages) =>
      previousImages.filter(
        (image) => image.publicId !== publicId
      )
    );
  };

  // Remove newly selected image
  const removeNewImage = (indexToRemove) => {
    setNewImages((previousImages) =>
      previousImages.filter(
        (_, index) => index !== indexToRemove
      )
    );
  };

  // Submit changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (existingImages.length + newImages.length > 5) {
        setError("Maximum 5 images are allowed.");
        setSaving(false);
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append(
        "discountPrice",
        formData.discountPrice || 0
      );
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("sku", formData.sku);

      // Send existing Cloudinary images
      data.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      // Send newly selected images
      newImages.forEach((image) => {
        data.append("images", image);
      });

      await api.put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Product updated successfully!");

      setTimeout(() => {
        navigate("/seller/products");
      }, 1000);
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      console.error(
        "UPDATE PRODUCT RESPONSE:",
        error.response
      );

      setError(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Edit Product
          </h1>

          <p className="text-gray-600 mt-2">
            Update your product information
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6"
        >
          {/* Product Name */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Discount Price
              </label>

              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Brand + SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SKU *
              </label>

              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category + Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Existing Images */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Existing Images
            </label>

            {existingImages.length === 0 ? (
              <p className="text-gray-500">
                No existing images.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {existingImages.map((image) => (
                  <div
                    key={image.publicId}
                    className="relative border rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-full h-32 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingImage(
                          image.publicId
                        )
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Images */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Add New Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              Maximum total images: 5. Maximum 5 MB per image.
            </p>

            {newImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {newImages.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative border rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(index)
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving
                ? "Updating Product..."
                : "Update Product"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/seller/products")
              }
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProduct;
