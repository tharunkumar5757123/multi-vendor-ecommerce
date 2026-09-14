import { useSelector } from "react-redux";

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">
          Welcome, {user?.name}
        </h1>

        <p className="mt-3 text-gray-600">
          Role: {user?.role}
        </p>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold">
            Customer Home
          </h2>

          <p className="mt-2 text-gray-600">
            Your e-commerce frontend will be built here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;