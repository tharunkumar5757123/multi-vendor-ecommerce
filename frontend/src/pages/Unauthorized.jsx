function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">
          403
        </h1>

        <h2 className="text-2xl font-semibold mt-4">
          Access Denied
        </h2>

        <p className="text-gray-600 mt-2">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;