import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addWishlistProduct,
  removeWishlistProduct,
} from "../redux/slices/wishlistSlice";
import { setCart } from "../redux/slices/cartSlice";
import api from "../services/api";
import { showToast } from "../utils/showToast";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const wishlistProducts = useSelector(
    (state) => state.wishlist.products || []
  );

  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isCustomer =
    isAuthenticated && user?.role === "customer";

  const isWishlisted = wishlistProducts.some(
    (item) => item?._id === product?._id
  );

  // Product image
  const productImage =
    product?.images?.length > 0
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0]?.url
      : "https://via.placeholder.com/500x500?text=No+Image";

  // Discount percentage
  const discountPercentage =
    product?.discountPrice &&
    product?.price > product?.discountPrice
      ? Math.round(
          ((product.price - product.discountPrice) /
            product.price) *
            100
        )
      : 0;

  // View product details
  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  // Add product to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isCustomer) {
      showToast(
        "warning",
        "Customer account required",
        "Only customers can add products to the cart."
      );
      return;
    }

    try {
      setCartLoading(true);

      // Add product to backend cart
      const response = await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      // Get updated cart from API response
      const updatedCart =
        response.data?.cart || response.data;

      // Update Redux cart immediately
      dispatch(setCart(updatedCart));

      showToast(
        "success",
        "Added to cart",
        "Product added to cart successfully."
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      showToast(
        "error",
        "Cart update failed",
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    } finally {
      setCartLoading(false);
    }
  };

  // Toggle wishlist
  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isCustomer) {
      showToast(
        "warning",
        "Customer account required",
        "Only customers can use the wishlist."
      );
      return;
    }

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        await api.delete(`/wishlist/${product._id}`);

        dispatch(removeWishlistProduct(product._id));
      } else {
        const response = await api.post(
          `/wishlist/${product._id}`
        );

        const addedProduct =
          response.data?.wishlist?.find(
            (item) => item?._id === product._id
          ) || product;

        dispatch(addWishlistProduct(addedProduct));
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      showToast(
        "error",
        "Wishlist update failed",
        error.response?.data?.message ||
          "Failed to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product Image */}
      <div
        className="relative h-64 cursor-pointer overflow-hidden bg-gray-100"
        onClick={handleViewDetails}
      >
        <img
          src={productImage}
          alt={product?.name || "Product"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/500x500?text=No+Image";
          }}
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Stock Badge */}
        {product?.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-600 shadow">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist();
          }}
          disabled={wishlistLoading}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
          title={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            className={`h-5 w-5 ${
              isWishlisted
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
            />
          </svg>
        </button>
      </div>

      {/* Product Information */}
      <div className="p-5">
        {/* Brand */}
        {product?.brand && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3
          onClick={handleViewDetails}
          className="mb-2 cursor-pointer truncate text-lg font-semibold text-gray-900 transition hover:text-indigo-600"
          title={product?.name}
        >
          {product?.name || "Unnamed Product"}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= Math.round(product?.rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>

          <span className="text-sm text-gray-500">
            ({product?.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3 flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">
            ₹
            {Number(
              product?.discountPrice ||
                product?.price ||
                0
            ).toLocaleString("en-IN")}
          </span>

          {product?.discountPrice &&
            product.discountPrice < product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹
                {Number(product.price).toLocaleString(
                  "en-IN"
                )}
              </span>
            )}
        </div>

        {/* Stock Information */}
        {product?.stock > 0 && product.stock <= 5 && (
          <p className="mb-3 text-xs font-semibold text-orange-600">
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
            disabled={
              product?.stock <= 0 || cartLoading
            }
            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {cartLoading
              ? "Adding..."
              : product?.stock <= 0
              ? "Unavailable"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;