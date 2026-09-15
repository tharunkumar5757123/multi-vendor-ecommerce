
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${id}`);

      const productData = response.data.product;

      setProduct(productData);

      if (productData.images?.length > 0) {
        setSelectedImage(productData.images[0].url);
      }
    } catch (error) {
      console.error("PRODUCT DETAILS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const getPrice = () => {
    if (!product) {
      return 0;
    }

    return product.discountPrice > 0
      ? product.discountPrice
      : product.price;
  };

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (product.stock <= 0) {
      setError("This product is out of stock.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      setSuccess("");

      await api.post("/cart", {
        productId: product._id,
        quantity,
      });

      setSuccess("Product added to cart successfully!");

      setTimeout(() => {
        navigate("/cart");
      }, 800);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setAdding(false);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Product not found
          </h1>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate("/products")}
          className="text-blue-600 hover:text-blue-800 font-medium mb-6"
        >
          ← Back to Products
        </button>

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

        {/* Product */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">

            {/* LEFT - Images */}
            <div>

              {/* Main Image */}
              <div className="h-[450px] bg-gray-100 rounded-xl overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto">
                  {product.images.map((image) => (
                    <button
                      key={image.publicId}
                      type="button"
                      onClick={() =>
                        setSelectedImage(image.url)
                      }
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        selectedImage === image.url
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* RIGHT - Information */}
            <div>

              {/* Category */}
              <p className="text-blue-600 font-medium">
                {product.category?.name ||
                  "Product"}
              </p>

              {/* Name */}
              <h1 className="text-4xl font-bold text-gray-800 mt-2">
                {product.name}
              </h1>

              {/* Brand */}
              {product.brand && (
                <p className="text-gray-500 mt-2">
                  Brand:{" "}
                  <span className="font-medium text-gray-700">
                    {product.brand}
                  </span>
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-yellow-500 text-xl">
                  ★
                </span>

                <span className="font-semibold">
                  {product.rating
                    ? product.rating.toFixed(1)
                    : "0.0"}
                </span>

                <span className="text-gray-500">
                  ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-800">
                  ₹{Number(getPrice()).toFixed(2)}
                </span>

                {product.discountPrice > 0 && (
                  <span className="ml-3 text-xl text-gray-400 line-through">
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Discount */}
              {product.discountPrice > 0 &&
                product.price > 0 && (
                  <p className="text-green-600 font-medium mt-2">
                    {Math.round(
                      ((product.price -
                        product.discountPrice) /
                        product.price) *
                        100
                    )}
                    % OFF
                  </p>
                )}

              {/* Stock */}
              <div className="mt-5">
                {product.stock > 0 ? (
                  <p className="text-green-600 font-semibold">
                    In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    Out of Stock
                  </p>
                )}
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="mt-6">
                  <p className="font-medium text-gray-700 mb-2">
                    Quantity
                  </p>

                  <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-12 h-11 text-xl hover:bg-gray-100 disabled:text-gray-300"
                    >
                      −
                    </button>

                    <span className="w-14 h-11 flex items-center justify-center border-x border-gray-300 font-semibold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="w-12 h-11 text-xl hover:bg-gray-100 disabled:text-gray-300"
                    >
                      +
                    </button>

                  </div>
                </div>
              )}

              {/* Add Cart */}
              <button
                onClick={handleAddToCart}
                disabled={
                  adding || product.stock <= 0
                }
                className="w-full mt-6 bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {adding
                  ? "Adding to Cart..."
                  : product.stock <= 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              {/* Seller */}
              <div className="mt-6 border-t pt-5">
                <p className="text-sm text-gray-500">
                  Sold by
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  {product.seller?.name ||
                    "Seller"}
                </p>

                {product.seller?.email && (
                  <p className="text-sm text-gray-500">
                    {product.seller.email}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Description */}
          <div className="border-t px-6 py-8 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Product Description
            </h2>

            <p className="text-gray-600 leading-7 mt-4 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* SKU */}
          <div className="border-t px-6 py-6 lg:px-8">
            <p className="text-sm text-gray-500">
              SKU
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {product.sku}
            </p>
          </div>

          {/* Reviews placeholder */}
          <div className="border-t px-6 py-8 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Customer Reviews
            </h2>

            <p className="text-gray-500 mt-3">
              Reviews and ratings will appear here.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ProductDetails;
