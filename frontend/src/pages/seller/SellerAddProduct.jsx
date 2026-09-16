import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { showToast } from "../../utils/showToast";

function SellerAddProduct() {
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

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [errors, setErrors] = useState({});

  // ----------------------------------
  // Load Categories
  // ----------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);

        const response = await api.get("/categories");

        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error("FETCH CATEGORIES ERROR:", error);

        showToast(
          "error",
          "Categories unavailable",
          error.response?.data?.message ||
            "Failed to load categories"
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ----------------------------------
  // Handle Input
  // ----------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ----------------------------------
  // Handle Images
  // ----------------------------------
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length > 5) {
      showToast(
        "warning",
        "Image limit reached",
        "You can upload maximum 5 images."
      );

      event.target.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      showToast(
        "warning",
        "Invalid file type",
        "Only image files are allowed."
      );

      event.target.value = "";
      return;
    }

    const largeFile = selectedFiles.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (largeFile) {
      showToast(
        "warning",
        "File too large",
        "Each image must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    setImages(selectedFiles);

    setErrors((previous) => ({
      ...previous,
      images: "",
    }));
  };

  // ----------------------------------
  // Validation
  // ----------------------------------
  const validateForm = () => {
    const newErrors = {};

    const price = Number(formData.price);
    const discountPrice = Number(formData.discountPrice);
    const stock = Number(formData.stock);

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.discountPrice !== "") {
      if (discountPrice < 0) {
        newErrors.discountPrice =
          "Discount price cannot be negative";
      } else if (discountPrice >= price) {
        newErrors.discountPrice =
          "Discount price must be less than regular price";
      }
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (formData.stock === "") {
      newErrors.stock = "Stock is required";
    } else if (stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    } else if (!Number.isInteger(stock)) {
      newErrors.stock = "Stock must be a whole number";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (images.length === 0) {
      newErrors.images = "Please select at least one image";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------------
  // Submit
  // ----------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setLoading(true);

      const productData = new FormData();

      productData.append("name", formData.name.trim());

      productData.append(
        "description",
        formData.description.trim()
      );

      productData.append("price", Number(formData.price));

      productData.append(
        "discountPrice",
        formData.discountPrice
          ? Number(formData.discountPrice)
          : 0
      );

      productData.append("brand", formData.brand.trim());

      productData.append("category", formData.category);

      productData.append("stock", Number(formData.stock));

      productData.append("sku", formData.sku.trim());

      images.forEach((image) => {
        productData.append("images", image);
      });

      const response = await api.post(
        "/products",
        productData
      );

      showToast(
        "success",
        "Product created",
        response.data?.message ||
          "Product created successfully"
      );

      navigate("/seller/products");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      showToast(
        "error",
        "Product creation failed",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // Render
  // ----------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add Product
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Add a new product to your store
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/seller/products")
              }
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              Back to Products
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 gap-5 mt-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  disabled={loading}
                  className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your product..."
                  disabled={loading}
                  className={`w-full border rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Price *
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    disabled={loading}
                    className={`w-full border rounded-lg pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    disabled={loading}
                    className={`w-full border rounded-lg pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.discountPrice
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                {errors.discountPrice && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.discountPrice}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="Enter stock quantity"
                  disabled={loading}
                  className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.stock
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.stock && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.stock}
                  </p>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Example: ELEC-001"
                  disabled={loading}
                  className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.sku
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.sku && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.sku}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Category */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Category
            </h2>

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={categoryLoading || loading}
                className={`w-full border rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">
                  {categoryLoading
                    ? "Loading categories..."
                    : "Select a category"}
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

              {errors.category && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.category}
                </p>
              )}

              {!categoryLoading &&
                categories.length === 0 && (
                  <p className="text-sm text-orange-600 mt-2">
                    No categories available. Please create a
                    category first.
                  </p>
                )}
            </div>
          </section>

          {/* Images */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Product Images
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Upload up to 5 images. Maximum 5MB per image.
            </p>

            <div className="mt-5">
              <label
                htmlFor="product-images"
                className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="text-4xl">📷</div>

                <p className="font-medium text-gray-700 mt-3">
                  Click to select images
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  JPG, PNG, WEBP
                </p>
              </label>

              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />

              {errors.images && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.images}
                </p>
              )}
            </div>

            {images.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Selected Images ({images.length}/5)
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={`${image.name}-${index}`}
                      className="relative"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-28 object-cover rounded-lg border"
                      />

                      <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Submit */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate("/seller/products")
                }
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || categoryLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating Product..."
                  : "Create Product"}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}

export default SellerAddProduct;