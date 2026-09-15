
function Rating({ rating = 0, numReviews = 0 }) {
  const roundedRating = Math.round(rating);

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= roundedRating
                ? "text-yellow-400 text-lg"
                : "text-gray-300 text-lg"
            }
          >
            ★
          </span>
        ))}
      </div>

      <span className="text-sm text-gray-500">
        {Number(rating).toFixed(1)} ({numReviews} reviews)
      </span>
    </div>
  );
}

export default Rating;
