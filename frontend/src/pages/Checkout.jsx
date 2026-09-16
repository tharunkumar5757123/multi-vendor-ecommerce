import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import AddressForm from "../components/AddressForm";
import api from "../services/api";
import { showToast } from "../utils/showToast";

function Checkout() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] =
    useState(false);
  const [orderLoading, setOrderLoading] =
    useState(false);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState(null);

  const [error, setError] = useState("");

  const isCustomer =
    isAuthenticated && user?.role === "customer";

  // =====================================================
  // FETCH CHECKOUT DATA
  // =====================================================
  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      setError("");

      const [cartResponse, addressResponse] =
        await Promise.all([
          api.get("/cart"),
          api.get("/addresses"),
        ]);

      const cartData =
        cartResponse.data.cart ||
        cartResponse.data;

      const addressData =
        addressResponse.data.addresses ||
        addressResponse.data ||
        [];

      setCart(cartData);
      setAddresses(addressData);

      // Select default address
      const defaultAddress = addressData.find(
        (address) => address.isDefault
      );

      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      } else if (addressData.length > 0) {
        setSelectedAddress(addressData[0]._id);
      } else {
        setSelectedAddress("");
      }
    } catch (error) {
      console.error(
        "Checkout data error:",
        error
      );

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load checkout details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AUTHENTICATION CHECK
  // =====================================================
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isCustomer) {
      navigate("/unauthorized");
      return;
    }

    fetchCheckoutData();
  }, [isAuthenticated, user?.role]);

  // =====================================================
  // ADD ADDRESS
  // =====================================================
  const handleAddAddress = async (formData) => {
    try {
      setAddressLoading(true);

      const response = await api.post(
        "/addresses",
        formData
      );

      const newAddress =
        response.data.address ||
        response.data;

      // If backend returns all updated data,
      // this still works with the new address.
      setAddresses((previous) => [
        ...previous,
        newAddress,
      ]);

      setSelectedAddress(newAddress._id);

      setShowAddressForm(false);
      setEditingAddress(null);

      showToast(
        "success",
        "Address saved",
        "Your new delivery address is selected for this order."
      );
    } catch (error) {
      console.error(
        "Add address error:",
        error
      );

      showToast(
        "error",
        "Address not saved",
        error.response?.data?.message ||
          "Failed to add address."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // =====================================================
  // EDIT ADDRESS
  // =====================================================
  const handleUpdateAddress = async (formData) => {
    if (!editingAddress?._id) {
      return;
    }

    try {
      setAddressLoading(true);

      const response = await api.put(
        `/addresses/${editingAddress._id}`,
        formData
      );

      const updatedAddress =
        response.data.address ||
        response.data;

      setAddresses((previous) =>
        previous.map((address) =>
          address._id === updatedAddress._id
            ? updatedAddress
            : address
        )
      );

      setSelectedAddress(
        updatedAddress._id
      );

      setEditingAddress(null);
      setShowAddressForm(false);

      showToast(
        "success",
        "Address updated",
        "Your delivery address has been updated."
      );
    } catch (error) {
      console.error(
        "Update address error:",
        error
      );

      showToast(
        "error",
        "Address not updated",
        error.response?.data?.message ||
          "Failed to update address."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // =====================================================
  // DELETE ADDRESS
  // =====================================================
  const handleDeleteAddress = async (
    addressId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setAddressLoading(true);

      await api.delete(
        `/addresses/${addressId}`
      );

      const remainingAddresses =
        addresses.filter(
          (address) =>
            address._id !== addressId
        );

      setAddresses(remainingAddresses);

      // If deleted address was selected,
      // select default or first remaining address.
      if (selectedAddress === addressId) {
        const defaultAddress =
          remainingAddresses.find(
            (address) => address.isDefault
          );

        if (defaultAddress) {
          setSelectedAddress(
            defaultAddress._id
          );
        } else if (
          remainingAddresses.length > 0
        ) {
          setSelectedAddress(
            remainingAddresses[0]._id
          );
        } else {
          setSelectedAddress("");
        }
      }

      // Close edit form if deleted address
      // was being edited.
      if (
        editingAddress?._id === addressId
      ) {
        setEditingAddress(null);
        setShowAddressForm(false);
      }

      showToast(
        "success",
        "Address deleted",
        "The delivery address has been removed."
      );
    } catch (error) {
      console.error(
        "Delete address error:",
        error
      );

      showToast(
        "error",
        "Address not deleted",
        error.response?.data?.message ||
          "Failed to delete address."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // =====================================================
  // EDIT ADDRESS BUTTON
  // =====================================================
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  // =====================================================
  // CANCEL ADDRESS FORM
  // =====================================================
  const handleCancelAddressForm = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  // =====================================================
  // CART ITEMS
  // =====================================================
  const cartItems = cart?.items || [];

  const getProduct = (item) => {
    return item?.product || {};
  };

  // =====================================================
  // PRODUCT PRICE
  // =====================================================
  const getPrice = (product) => {
    if (
      product?.discountPrice &&
      product.discountPrice < product.price
    ) {
      return Number(product.discountPrice);
    }

    return Number(product?.price || 0);
  };

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================
  const getImageUrl = (product) => {
    const fallback =
      "https://via.placeholder.com/100x100?text=No+Image";

    if (
      !product?.images ||
      product.images.length === 0
    ) {
      return fallback;
    }

    const image = product.images[0];

    if (typeof image === "string") {
      return image;
    }

    return image?.url || fallback;
  };

  // =====================================================
  // CALCULATE SUBTOTAL
  // =====================================================
  const subtotal = cartItems.reduce(
    (total, item) => {
      const product = getProduct(item);

      return (
        total +
        getPrice(product) *
          Number(item?.quantity || 0)
      );
    },
    0
  );

  const roundedSubtotal = Number(
    subtotal.toFixed(2)
  );

  // =====================================================
  // SHIPPING
  // =====================================================
  const shipping =
    roundedSubtotal >= 1000 ? 0 : 50;

  // =====================================================
  // TAX - 5%
  // =====================================================
  const tax = Number(
    (roundedSubtotal * 0.05).toFixed(2)
  );

  // =====================================================
  // TOTAL
  // =====================================================
  const total = Number(
    (
      roundedSubtotal +
      shipping +
      tax
    ).toFixed(2)
  );

  // =====================================================
  // CHECK PRODUCT AVAILABILITY
  // =====================================================
  const unavailableItem = cartItems.find(
    (item) => {
      const product = getProduct(item);

      if (!product?._id) {
        return true;
      }

      if (
        product.isActive === false ||
        Number(product.stock) <= 0
      ) {
        return true;
      }

      if (
        Number(item.quantity) >
        Number(product.stock)
      ) {
        return true;
      }

      return false;
    }
  );

  // =====================================================
  // PLACE ORDER
  // =====================================================
  const handlePlaceOrder = async () => {
    if (orderLoading) {
      return;
    }

    if (!selectedAddress) {
      showToast(
        "warning",
        "Choose an address",
        "Please select a delivery address."
      );
      return;
    }

    if (addresses.length === 0) {
      showToast(
        "warning",
        "Add a delivery address",
        "Please add a delivery address."
      );
      return;
    }

    if (cartItems.length === 0) {
      showToast(
        "info",
        "Cart is empty",
        "Add a product before placing an order."
      );

      navigate("/products");
      return;
    }

    if (unavailableItem) {
      showToast(
        "error",
        "Update your cart",
        "One or more items are unavailable or do not have enough stock."
      );

      navigate("/cart");
      return;
    }

    try {
      setOrderLoading(true);

      // =================================================
      // CREATE ORDER
      // =================================================
      const orderResponse = await api.post(
        "/orders",
        {
          addressId: selectedAddress,
          paymentMethod,
        }
      );

      const order =
        orderResponse.data.order ||
        orderResponse.data;

      const orderId =
        order?._id ||
        order?.id ||
        order?.orderId;

      if (!orderId) {
        throw new Error(
          "Order ID was not returned by the server."
        );
      }

      // =================================================
      // COD
      // =================================================
      if (paymentMethod === "cod") {
        showToast(
          "success",
          "Order placed",
          "Your cash on delivery order is ready to track."
        );

        navigate(
          `/orders/${orderId}`
        );

        return;
      }

      // =================================================
      // ONLINE PAYMENT
      // =================================================
      const paymentResponse =
        await api.post(
          "/payments/create-checkout-session",
          {
            orderId,
          }
        );

      const checkoutUrl =
        paymentResponse.data.url ||
        paymentResponse.data.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error(
          "Payment checkout URL was not returned by the server."
        );
      }

      showToast(
        "info",
        "Opening secure payment",
        "You are being redirected to Stripe to finish payment."
      );

      // Redirect to Stripe
      window.location.href =
        checkoutUrl;
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      showToast(
        "error",
        "Order could not be placed",
        error.response?.data?.message ||
          error.message ||
          "Failed to place order."
      );
    } finally {
      setOrderLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (
    loading ||
    !isAuthenticated ||
    !isCustomer
  ) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader text="Loading checkout..." />
        </div>

        <Footer />
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">
              ⚠️
            </div>

            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Checkout Error
            </h2>

            <p className="mb-6 text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchCheckoutData}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="mb-4 text-6xl">
              🛒
            </div>

            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Your Cart is Empty
            </h2>

            <p className="mb-6 text-gray-500">
              Add some products before
              proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Browse Products
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gray-900 px-4 py-10 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-sm font-medium text-indigo-300">
              SECURE CHECKOUT
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Checkout
            </h1>

            <p className="mt-2 text-gray-300">
              Complete your order securely.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* ================================================= */}
            {/* LEFT SIDE */}
            {/* ================================================= */}
            <div className="space-y-6 lg:col-span-2">
              {/* ================================================= */}
              {/* DELIVERY ADDRESS */}
              {/* ================================================= */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Delivery Address
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Choose where you want your
                      order delivered.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        showAddressForm
                      ) {
                        handleCancelAddressForm();
                      } else {
                        setEditingAddress(null);
                        setShowAddressForm(true);
                      }
                    }}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    {showAddressForm
                      ? "Cancel"
                      : "+ Add Address"}
                  </button>
                </div>

                {/* ================================================= */}
                {/* ADDRESS FORM */}
                {/* ================================================= */}
                {showAddressForm && (
                  <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                    <h3 className="mb-4 font-semibold text-gray-900">
                      {editingAddress
                        ? "Edit Address"
                        : "Add New Address"}
                    </h3>

                    <AddressForm
                      initialData={
                        editingAddress
                      }
                      onSubmit={
                        editingAddress
                          ? handleUpdateAddress
                          : handleAddAddress
                      }
                      onCancel={
                        handleCancelAddressForm
                      }
                      loading={
                        addressLoading
                      }
                    />
                  </div>
                )}

                {/* ================================================= */}
                {/* NO ADDRESSES */}
                {/* ================================================= */}
                {addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <div className="mb-3 text-4xl">
                      📍
                    </div>

                    <p className="mb-4 text-gray-500">
                      You don't have any saved
                      addresses.
                    </p>

                    {!showAddressForm && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(null);
                          setShowAddressForm(true);
                        }}
                        className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Add Delivery Address
                      </button>
                    )}
                  </div>
                ) : (
                  /* ================================================= */
                  /* ADDRESS LIST */
                  /* ================================================= */
                  <div className="space-y-3">
                    {addresses.map(
                      (address) => (
                        <div
                          key={address._id}
                          className={`rounded-xl border-2 p-4 transition ${
                            selectedAddress ===
                            address._id
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex gap-3">
                            <input
                              type="radio"
                              name="address"
                              value={
                                address._id
                              }
                              checked={
                                selectedAddress ===
                                address._id
                              }
                              onChange={(e) =>
                                setSelectedAddress(
                                  e.target.value
                                )
                              }
                              className="mt-1 h-4 w-4 accent-indigo-600"
                            />

                            <div className="min-w-0 flex-1">
                              {/* Name + Default */}
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <p className="font-bold text-gray-900">
                                  {
                                    address.fullName
                                  }
                                </p>

                                {address.isDefault && (
                                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                    Default
                                  </span>
                                )}
                              </div>

                              {/* Phone */}
                              <p className="text-sm text-gray-600">
                                {
                                  address.phone
                                }
                              </p>

                              {/* Address */}
                              <p className="mt-2 text-sm leading-6 text-gray-600">
                                {
                                  address.address
                                }
                                ,{" "}
                                {
                                  address.city
                                }
                                ,{" "}
                                {
                                  address.state
                                }{" "}
                                -{" "}
                                {
                                  address.pincode
                                }
                              </p>

                              {/* Edit / Delete */}
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditAddress(
                                      address
                                    )
                                  }
                                  disabled={
                                    addressLoading
                                  }
                                  className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteAddress(
                                      address._id
                                    )
                                  }
                                  disabled={
                                    addressLoading
                                  }
                                  className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* ================================================= */}
              {/* PAYMENT METHOD */}
              {/* ================================================= */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-bold text-gray-900">
                  Payment Method
                </h2>

                <p className="mb-5 text-sm text-gray-500">
                  Select how you want to pay
                  for your order.
                </p>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`block cursor-pointer rounded-xl border-2 p-4 transition ${
                      paymentMethod ===
                      "cod"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={
                          paymentMethod ===
                          "cod"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                        className="h-4 w-4 accent-indigo-600"
                      />

                      <div>
                        <p className="font-semibold text-gray-900">
                          Cash on Delivery
                        </p>

                        <p className="text-sm text-gray-500">
                          Pay when your order
                          arrives.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* STRIPE */}
                  <label
                    className={`block cursor-pointer rounded-xl border-2 p-4 transition ${
                      paymentMethod ===
                      "online"
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={
                          paymentMethod ===
                          "online"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                        className="h-4 w-4 accent-indigo-600"
                      />

                      <div>
                        <p className="font-semibold text-gray-900">
                          Online Payment
                        </p>

                        <p className="text-sm text-gray-500">
                          Pay securely using
                          Stripe.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* ================================================= */}
              {/* SECURITY */}
              {/* ================================================= */}
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex gap-3">
                  <span className="text-xl">
                    🔒
                  </span>

                  <div>
                    <p className="font-semibold text-green-800">
                      Secure Checkout
                    </p>

                    <p className="text-sm text-green-700">
                      Your payment and personal
                      information are protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* RIGHT SIDE - ORDER SUMMARY */}
            {/* ================================================= */}
            <div>
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                {/* ================================================= */}
                {/* ITEMS */}
                {/* ================================================= */}
                <div className="mb-6 max-h-72 space-y-4 overflow-y-auto">
                  {cartItems.map((item) => {
                    const product =
                      getProduct(item);

                    const price =
                      getPrice(product);

                    return (
                      <div
                        key={
                          product?._id ||
                          item?.product
                        }
                        className="flex gap-3"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={getImageUrl(
                              product
                            )}
                            alt={
                              product?.name ||
                              "Product"
                            }
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/100x100?text=No+Image";
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {product?.name ||
                              "Product"}
                          </p>

                          <p className="text-xs text-gray-500">
                            Qty:{" "}
                            {item.quantity}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-800">
                            ₹
                            {(
                              price *
                              Number(
                                item.quantity ||
                                  0
                              )
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ================================================= */}
                {/* TOTALS */}
                {/* ================================================= */}
                <div className="space-y-4 border-t border-gray-200 pt-5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>

                    <span className="font-medium text-gray-900">
                      ₹
                      {roundedSubtotal.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>

                    <span className="font-medium text-gray-900">
                      {shipping === 0
                        ? "FREE"
                        : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>

                    <span className="font-medium text-gray-900">
                      ₹
                      {tax.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-indigo-600">
                        ₹
                        {total.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ================================================= */}
                {/* STOCK WARNING */}
                {/* ================================================= */}
                {unavailableItem && (
                  <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    One or more products are
                    unavailable or have insufficient
                    stock. Please update your cart.
                  </div>
                )}

                {/* ================================================= */}
                {/* PLACE ORDER */}
                {/* ================================================= */}
                <button
                  type="button"
                  onClick={
                    handlePlaceOrder
                  }
                  disabled={
                    orderLoading ||
                    !selectedAddress ||
                    addresses.length === 0 ||
                    !!unavailableItem
                  }
                  className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {orderLoading
                    ? "Processing..."
                    : paymentMethod ===
                      "online"
                    ? "Continue to Payment"
                    : "Place Order"}
                </button>

                {/* ================================================= */}
                {/* BACK TO CART */}
                {/* ================================================= */}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/cart")
                  }
                  disabled={orderLoading}
                  className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back to Cart
                </button>

                <div className="mt-5 text-center text-xs text-gray-500">
                  By placing this order, you
                  agree to our terms and conditions.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;