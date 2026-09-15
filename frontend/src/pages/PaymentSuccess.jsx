import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmPaymentPage = async () => {
      try {
        /*
          Stripe redirects the customer to this page after
          successful checkout.

          The actual payment confirmation/update is handled
          by the Stripe webhook on the backend.

          Therefore, we don't mark the order as paid from
          the frontend.
        */

        console.log("Stripe session:", sessionId);

        // Small delay so the success page doesn't appear abruptly.
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Payment success page error:", error);
      } finally {
        setLoading(false);
      }
    };

    confirmPaymentPage();
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 px-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

            <p className="mt-4 text-sm font-medium text-gray-600">
              Finalizing your secure payment...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 px-6 py-12">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-lg animate-fade-up rounded-2xl border border-green-100 bg-white p-8 text-center shadow-xl shadow-green-900/5 sm:p-10">

            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 animate-pop-in items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
              <span className="text-3xl font-black text-green-600">
                ✓
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Successful!
            </h1>

            {/* Description */}
            <p className="mt-3 leading-6 text-gray-500">
              Your payment went through. We are preparing your order and keeping the status updated in My Orders.
            </p>

            {/* Session Information */}
            {sessionId && (
              <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left">
                <p className="text-sm font-medium text-gray-500">
                  Payment Session
                </p>

                <p className="mt-1 break-all text-xs text-gray-600">
                  {sessionId}
                </p>
              </div>
            )}

            {/* Important Note */}
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-left">
              <p className="text-sm font-semibold text-green-800">
                Order processing
              </p>

              <p className="mt-1 text-sm leading-5 text-green-700">
                If the order still shows pending for a moment, the payment webhook is still syncing. Refresh My Orders shortly.
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
                onClick={() => navigate("/products")}
                className="w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-50"
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

export default PaymentSuccess;
