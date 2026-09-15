import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">

            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <span className="text-4xl font-bold text-red-600">
                !
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Cancelled
            </h1>

            {/* Description */}
            <p className="mt-3 leading-6 text-gray-500">
              Your Stripe payment was cancelled before completion.
              Your order can be reviewed from the Orders page.
            </p>

            {/* Info */}
            <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-left">
              <p className="text-sm font-semibold text-yellow-800">
                Payment not completed
              </p>

              <p className="mt-1 text-sm leading-5 text-yellow-700">
                If an order was created before the payment was cancelled,
                you can check its current payment status in My Orders.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3">

              <button
                onClick={() => navigate("/orders")}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                View My Orders
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back to Cart
              </button>

              <button
                onClick={() => navigate("/products")}
                className="w-full rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Continue Shopping
              </button>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PaymentCancelled;