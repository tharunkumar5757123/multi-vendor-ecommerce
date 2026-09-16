import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import api from "../services/api";
import { showToast } from "../utils/showToast";

import {
  addWishlistProduct,
  removeWishlistProduct,
} from "../redux/slices/wishlistSlice";

import { setCart } from "../redux/slices/cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistProducts = useSelector(
    (state) => state.wishlist.products || []
  );

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const isWishlisted = wishlistProducts.some(
    (item) => item?._id === id
  );

  // Fetch product
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/products/${id}`);

      setProduct(response.data.product || response.data);
    } catch (error) {
      console.error("Product fetch error:", error);

      if (error.response?.status === 404) {
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await api.get(
        `/reviews/product/${id}`
      );

      setReviews(
        response.data.reviews || response.data || []
      );
    } catch (error) {
      console.error("Reviews fetch error:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!product || product.stock <= 0) {
      return;
    }

    try {
      setCartLoading(true);

      // Add product to backend cart
      const response = await api.post("/cart", {
        productId: product._id,
        quantity,
      });

      // Get updated cart
      const updatedCart =
        response.data?.cart || response.data;

      // Update Redux immediately
      dispatch(setCart(updatedCart));

      showToast(
        "success",
        "Added to cart",
        "Product added to cart."
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      showToast(
        "error",
        "Cart update failed",
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!product || product.stock <= 0) {
      return;
    }

    try {
      setCartLoading(true);

      // Add product to backend cart
      const response = await api.post("/cart", {
        productId: product._id,
        quantity,
      });

      // Update Redux immediately
      const updatedCart =
        response.data?.cart || response.data;

      dispatch(setCart(updatedCart));

      // Go to cart
      navigate("/cart");
    } catch (error) {
      console.error("Buy now error:", error);

      showToast(
        "error",
        "Unable to continue",
        error.response?.data?.message ||
          "Unable to continue"
      );
    } finally {
      setCartLoading(false);
    }
  };

  // Wishlist
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
        const response = await api.post(
          `/wishlist/${product._id}`
        );

        dispatch(
          addWishlistProduct(
            response.data.product || product
          )
        );
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      showToast(
        "error",
        "Wishlist update failed",
        error.response?.data?.message ||
          "Failed to update wishlist"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // Quantity controls
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((previous) => previous + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((previous) => previous - 1);
    }
  };

  // Review form
  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value,
    });
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!reviewForm.comment.trim()) {
      showToast(
        "warning",
        "Review required",
        "Please enter a review."
      );
      return;
    }

    try {
      setReviewLoading(true);

      await api.post(`/reviews/product/${id}`, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      showToast(
        "success",
        "Review submitted",
        "Review submitted successfully."
      );

      setReviewForm({
        rating: 5,
        comment: "",
      });

      await fetchReviews();
      await fetchProduct();
    } catch (error) {
      console.error("Review error:", error);

      showToast(
        "error",
        "Review failed",
        error.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>

        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            Product Not Found
          </h2>

          <p className="mb-6 text-gray-500">
            The product you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Browse Products
          </button>
        </div>

        <Footer />
      </>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [];

  const getImageUrl = (image) => {
    if (typeof image === "string") {
      return image;
    }

    return image?.url || "";
  };

  const mainImage =
    images.length > 0
      ? getImageUrl(images[selectedImage])
      : "https://via.placeholder.com/600x600?text=No+Image";

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) /
          product.price) *
          100
      )
    : 0;

  const displayPrice =
    product.discountPrice || product.price;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-indigo-600"
            >
              Home
            </button>

            <span>/</span>

            <button
              onClick={() => navigate("/products")}
              className="hover:text-indigo-600"
            >
              Products
            </button>

            <span>/</span>

            <span className="truncate text-gray-800">
              {product.name}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <section className="mx-auto max-w-7xl px-4 pb-12">
          <div className="grid gap-10 rounded-2xl bg-white p-5 shadow-sm md:p-8 lg:grid-cols-2">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />

                {hasDiscount && (
                  <span className="absolute left-4 top-4 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedImage(index)
                      }
                      className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                        selectedImage === index
                          ? "border-indigo-600"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information */}
            <div className="flex flex-col">
              {product.brand && (
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  {product.brand}
                </p>
              )}

              <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex text-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <=
                        Math.round(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <span className="text-sm text-gray-500">
                  {Number(product.rating || 0).toFixed(1)} (
                  {product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-5 flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹
                  {Number(displayPrice || 0).toLocaleString(
                    "en-IN"
                  )}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹
                      {Number(product.price).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span className="font-semibold text-green-600">
                      Save ₹
                      {Number(
                        product.price -
                          product.discountPrice
                      ).toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-6 border-t border-gray-200 pt-5">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Description
                </h3>

                <p className="leading-7 text-gray-600">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* Product Information */}
              <div className="mb-6 grid grid-cols-2 gap-4 border-y border-gray-200 py-5">
                <div>
                  <p className="text-sm text-gray-500">
                    SKU
                  </p>

                  <p className="font-semibold text-gray-800">
                    {product.sku || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Stock
                  </p>

                  <p
                    className={`font-semibold ${
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of Stock"}
                  </p>
                </div>

                {product.category && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Category
                    </p>

                    <p className="font-semibold text-gray-800">
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name || "N/A"}
                    </p>
                  </div>
                )}

                {product.seller && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Seller
                    </p>

                    <p className="font-semibold text-gray-800">
                      {typeof product.seller === "string"
                        ? product.seller
                        : product.seller?.name || "N/A"}
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-300">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-lg hover:bg-gray-100 disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="min-w-12 border-x border-gray-300 px-4 py-2 text-center font-semibold">
                      {quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      disabled={
                        quantity >= product.stock
                      }
                      className="px-4 py-2 text-lg hover:bg-gray-100 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    product.stock <= 0 || cartLoading
                  }
                  className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {cartLoading
                    ? "Processing..."
                    : product.stock <= 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={
                    product.stock <= 0 || cartLoading
                  }
                  className="flex-1 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className={`rounded-xl border px-5 py-3 font-semibold transition ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isWishlisted
                    ? "♥ Saved"
                    : "♡ Wishlist"}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <section className="mt-10 grid gap-8 lg:grid-cols-3">
            {/* Review Form */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Write a Review
              </h2>

              <form onSubmit={handleSubmitReview}>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Rating
                </label>

                <select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                  className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                >
                  <option value="5">
                    ★★★★★ - Excellent
                  </option>
                  <option value="4">
                    ★★★★ - Good
                  </option>
                  <option value="3">
                    ★★★ - Average
                  </option>
                  <option value="2">
                    ★★ - Poor
                  </option>
                  <option value="1">
                    ★ - Very Poor
                  </option>
                </select>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Comment
                </label>

                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  rows="5"
                  placeholder="Share your experience..."
                  className="mb-4 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                />

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {reviewLoading
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </form>
            </div>

            {/* Review List */}
            <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Customer Reviews
              </h2>

              {reviews.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No reviews yet. Be the first to review this
                  product.
                </div>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-200 pb-5 last:border-b-0"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.user?.name ||
                              review.user?.email ||
                              "Customer"}
                          </p>

                          <div className="flex text-sm">
                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <span
                                  key={star}
                                  className={
                                    star <= review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                >
                                  ★
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        {review.createdAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString("en-IN")}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ProductDetails;