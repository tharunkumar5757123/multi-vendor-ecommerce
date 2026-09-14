import { useSelector } from "react-redux";

function SellerDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold">
        Seller Dashboard
      </h1>

      <p className="mt-3 text-gray-600">
        Welcome, {user?.name}
      </p>
    </div>
  );
}

export default SellerDashboard;