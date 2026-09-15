
function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

        {/* Loading Text */}
        <p className="text-sm font-medium text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
}

export default Loader;
