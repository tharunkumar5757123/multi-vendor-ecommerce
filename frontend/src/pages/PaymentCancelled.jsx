import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 px-6 py-12">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-lg animate-fade-up rounded-2xl border border-amber-100 bg-white p-8 text-center shadow-xl shadow-amber-900/5 sm:p-10">

            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 animate-pop-in items-center justify-center rounded-full bg-amber-100 ring-8 ring-amber-50">
              <span className="text-4xl font-black text-amber-600">
                !
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Cancelled
            </h1>

            {/* Description */}
            <p className="mt-3 leading-6 text-gray-500">
              Your payment was not completed. You can review any created order or return to your cart to try again.
            </p>

            {/* Info */}
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
              <p className="text-sm font-semibold text-amber-800">
                Payment not completed
              </p>

              <p className="mt-1 text-sm leading-5 text-amber-700">
                If an order was created before cancellation, My Orders will show its current payment status.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3">

              <button
                onClick={() => navigate("/orders")}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                View My Orders
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-50"
              >
                Back to Cart
              </button>

              <button
                onClick={() => navigate("/products")}
                className="w-full rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-600 transition hover:-translate-y-0.5 hover:bg-gray-50"
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
