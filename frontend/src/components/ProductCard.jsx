import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addWishlistProduct,
  removeWishlistProduct,
} from "../redux/slices/wishlistSlice";
import api from "../services/api";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistProducts = useSelector(
    (state) => state.wishlist.products
  );

  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isWishlisted = wishlistProducts.some(
    (item) => item._id === product._id
  );

  // Get product image
  const productImage =
    product.images?.length > 0
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0]?.url
      : "https://via.placeholder.com/500x500?text=No+Image";

  // Calculate discount percentage
  const discountPercentage =
    product.discountPrice && product.price > product.discountPrice
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0;

  // Add product to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);

      await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      alert("Product added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        error.response?.data?.message || "Failed to add product to cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  // Toggle wishlist
  const handleWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        await api.delete(`/wishlist/${product._id}`);

        dispatch(removeWishlistProduct(product._id));
      } else {
        const response = await api.post(`/wishlist/${product._id}`);

        dispatch(
          addWishlistProduct(response.data.product || product)
        );
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update wishlist"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product Image */}
      <div
        className="relative h-64 cursor-pointer overflow-hidden bg-gray-100"
        onClick={handleViewDetails}
      >
        <img
          src={productImage}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-lg bg-white px-4 py-2 font-semibold text-red-600">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist();
          }}
          disabled={wishlistLoading}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 disabled:opacity-60"
          title={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <span
            className={`text-xl ${
              isWishlisted ? "text-red-500" : "text-gray-500"
            }`}
          >
            {isWishlisted ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {/* Product Information */}
      <div className="p-5">
        {/* Brand */}
        {product.brand && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3
          onClick={handleViewDetails}
          className="mb-2 cursor-pointer truncate text-lg font-semibold text-gray-900 hover:text-indigo-600"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= Math.round(product.rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>

          <span className="text-sm text-gray-500">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">
            ₹
            {Number(
              product.discountPrice || product.price || 0
            ).toLocaleString("en-IN")}
          </span>

          {product.discountPrice &&
            product.discountPrice < product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            )}
        </div>

        {/* Stock Information */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="mb-3 text-xs font-medium text-orange-600">
            Only {product.stock} left in stock
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleViewDetails}
            className="flex-1 rounded-lg border border-indigo-600 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            View Details
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || cartLoading}
            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {cartLoading
              ? "Adding..."
              : product.stock <= 0
              ? "Unavailable"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;