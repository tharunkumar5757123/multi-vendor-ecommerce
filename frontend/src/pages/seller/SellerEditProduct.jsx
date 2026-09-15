
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function SellerEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

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

  const [newImages, setNewImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});

  // ----------------------------------
  // Load Product + Categories
  // ----------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [productResponse, categoryResponse] =
          await Promise.all([
            api.get(`/products/${id}`),
            api.get("/categories"),
          ]);

        const loadedProduct =
          productResponse.data.product;

        setProduct(loadedProduct);

        setFormData({
          name: loadedProduct.name || "",
          description:
            loadedProduct.description || "",
          price: loadedProduct.price ?? "",
          discountPrice:
            loadedProduct.discountPrice ?? "",
          brand: loadedProduct.brand || "",
          category:
            loadedProduct.category?._id ||
            loadedProduct.category ||
            "",
          stock: loadedProduct.stock ?? "",
          sku: loadedProduct.sku || "",
        });

        setCategories(
          categoryResponse.data.categories || []
        );
      } catch (error) {
        console.error(
          "LOAD EDIT PRODUCT ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Failed to load product"
        );

        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

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
  // Select New Images
  // ----------------------------------
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length > 5) {
      alert("You can select maximum 5 new images.");
      event.target.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      alert("Only image files are allowed.");
      event.target.value = "";
      return;
    }

    const largeFile = selectedFiles.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (largeFile) {
      alert("Each image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setNewImages(selectedFiles);
  };

  // ----------------------------------
  // Remove Existing Image
  // ----------------------------------
  const handleRemoveExistingImage = (image) => {
    if (!image?.publicId) {
      return;
    }

    setRemoveImages((previous) => {
      if (previous.includes(image.publicId)) {
        return previous;
      }

      return [...previous, image.publicId];
    });
  };

  // ----------------------------------
  // Restore Existing Image
  // ----------------------------------
  const handleRestoreExistingImage = (publicId) => {
    setRemoveImages((previous) =>
      previous.filter((id) => id !== publicId)
    );
  };

  // ----------------------------------
  // Validation
  // ----------------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Product description is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price =
        "Price must be greater than 0";
    }

    if (
      formData.discountPrice &&
      Number(formData.discountPrice) < 0
    ) {
      newErrors.discountPrice =
        "Discount price cannot be negative";
    }

    if (
      formData.discountPrice &&
      Number(formData.discountPrice) >=
        Number(formData.price)
    ) {
      newErrors.discountPrice =
        "Discount price must be less than regular price";
    }

    if (!formData.category) {
      newErrors.category =
        "Please select a category";
    }

    if (formData.stock === "") {
      newErrors.stock = "Stock is required";
    } else if (Number(formData.stock) < 0) {
      newErrors.stock =
        "Stock cannot be negative";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
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
      setSaving(true);

      const productData = new FormData();

      productData.append(
        "name",
        formData.name.trim()
      );

      productData.append(
        "description",
        formData.description.trim()
      );

      productData.append(
        "price",
        Number(formData.price)
      );

      productData.append(
        "discountPrice",
        formData.discountPrice
          ? Number(formData.discountPrice)
          : 0
      );

      productData.append(
        "brand",
        formData.brand.trim()
      );

      productData.append(
        "category",
        formData.category
      );

      productData.append(
        "stock",
        Number(formData.stock)
      );

      productData.append(
        "sku",
        formData.sku.trim()
      );

      /*
        Send public IDs of images
        that should be removed.
      */
      removeImages.forEach((publicId) => {
        productData.append(
          "removeImages",
          publicId
        );
      });

      /*
        Send newly selected images.
      */
      newImages.forEach((image) => {
        productData.append("images", image);
      });

      const response = await api.put(
        `/products/${id}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(
        response.data?.message ||
          "Product updated successfully"
      );

      navigate("/seller/products");
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------
  // Loading
  // ----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

          <p className="mt-4 text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const existingImages = product.images || [];

  const visibleExistingImages =
    existingImages.filter(
      (image) =>
        !removeImages.includes(image.publicId)
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Product
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Update your product information
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/seller/products")
              }
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50"
            >
              Back to Products
            </button>
          </div>
        </div>
      </header>

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

            <div className="space-y-5 mt-5">
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
                  placeholder="Enter brand"
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
                  Stock *
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
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
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
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

              {errors.category && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.category}
                </p>
              )}
            </div>
          </section>

          {/* Existing Images */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Product Images
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Remove old images or upload new ones.
            </p>

            {existingImages.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Existing Images
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {existingImages.map(
                    (image, index) => {
                      const isRemoved =
                        removeImages.includes(
                          image.publicId
                        );

                      return (
                        <div
                          key={
                            image.publicId ||
                            index
                          }
                          className="relative"
                        >
                          <img
                            src={image.url}
                            alt={`${formData.name} ${
                              index + 1
                            }`}
                            className={`w-full h-28 object-cover rounded-lg border ${
                              isRemoved
                                ? "opacity-30"
                                : ""
                            }`}
                          />

                          {isRemoved ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleRestoreExistingImage(
                                  image.publicId
                                )
                              }
                              className="absolute inset-0 m-auto w-fit h-fit px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveExistingImage(
                                  image
                                )
                              }
                              className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white"
              />

              <p className="text-xs text-gray-500 mt-2">
                Maximum 5 new images, 5MB each.
              </p>
            </div>

            {newImages.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  New Images ({newImages.length})
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {newImages.map((image, index) => (
                    <div
                      key={`${image.name}-${index}`}
                    >
                      <img
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={`New image ${
                          index + 1
                        }`}
                        className="w-full h-28 object-cover rounded-lg border"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visibleExistingImages.length === 0 &&
              newImages.length === 0 && (
                <p className="text-sm text-orange-600 mt-4">
                  Warning: this product currently has
                  no visible images.
                </p>
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
                disabled={saving}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving Changes..."
                  : "Update Product"}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}

export default SellerEditProduct;
