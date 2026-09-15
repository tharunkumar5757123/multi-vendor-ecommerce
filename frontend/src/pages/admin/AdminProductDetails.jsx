
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${id}`);

      setProduct(response.data.product || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load product details"
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") {
      return image;
    }

    return image.url || "";
  };

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

          <p className="text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <p className="mb-4 text-red-600">
          {error}
        </p>

        <button
          onClick={() => navigate("/admin/products")}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <p className="text-gray-600">
          Product not found.
        </p>
      </div>
    );
  }

  const finalPrice =
    product.discountPrice && product.discountPrice > 0
      ? product.discountPrice
      : product.price;

  const discount =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) /
            product.price) *
            100
        )
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Product Details
          </h1>

          <p className="text-sm text-gray-500">
            View complete product information
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/products")}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Images */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Product Images
          </h2>

          {product.images?.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {product.images.map((image, index) => {
                const imageUrl = getImageUrl(image);

                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border bg-gray-50"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={`${product.name} ${index + 1}`}
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              No product images
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {product.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {product.brand || "No brand"}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                product.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(finalPrice)}
              </span>

              {product.discountPrice > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>

                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2 font-semibold text-gray-800">
              Description
            </h3>

            <p className="leading-7 text-gray-600">
              {product.description ||
                "No description available."}
            </p>
          </div>

          {/* Product Information */}
          <div className="border-t pt-5">
            <h3 className="mb-4 font-semibold text-gray-800">
              Product Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">
                  SKU
                </p>

                <p className="font-medium text-gray-800">
                  {product.SKU || product.sku || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Stock
                </p>

                <p className="font-medium text-gray-800">
                  {product.stock ?? 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Rating
                </p>

                <p className="font-medium text-gray-800">
                  ⭐ {product.rating ?? 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Category
                </p>

                <p className="font-medium text-gray-800">
                  {product.category?.name ||
                    product.category ||
                    "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Seller */}
          <div className="mt-6 border-t pt-5">
            <h3 className="mb-3 font-semibold text-gray-800">
              Seller
            </h3>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-800">
                {product.seller?.name || "Unknown Seller"}
              </p>

              <p className="text-sm text-gray-500">
                {product.seller?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductDetails;
