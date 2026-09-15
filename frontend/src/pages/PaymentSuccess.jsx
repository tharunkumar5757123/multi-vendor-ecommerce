
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findOrder = async () => {
      try {
        /*
          Your Stripe checkout session contains the orderId
          in metadata on the backend.

          We currently don't have a frontend endpoint to retrieve
          the Stripe session directly, so the safest approach for
          this page is to show the success state and let the user
          open My Orders.
        */

        console.log("Stripe session:", sessionId);

        setLoading(false);
      } catch (error) {
        console.error("Payment success error:", error);
        setLoading(false);
      }
    };

    findOrder();
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">
            Confirming payment...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="bg-white rounded-2xl shadow-md p-10 max-w-lg w-full text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <span className="text-4xl">
              ✓
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Payment Successful!
          </h1>

          <p className="text-gray-500 mt-3">
            Your payment was completed successfully.
            Your order is being processed.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mt-6 text-left">
              <p className="text-sm text-gray-500">
                Payment Session
              </p>

              <p className="text-sm font-medium text-gray-700 break-all mt-1">
                {sessionId}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-7">

            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default PaymentSuccess;
