import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="bg-white rounded-2xl shadow-md p-10 max-w-lg w-full text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
            <span className="text-4xl text-red-600">
              !
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Payment Cancelled
          </h1>

          <p className="text-gray-500 mt-3">
            Your Stripe payment was cancelled.
            You can return to your orders and try again.
          </p>

          <div className="flex flex-col gap-3 mt-7">

            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Back to Cart
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default PaymentCancelled;
