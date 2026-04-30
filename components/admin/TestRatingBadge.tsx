export default function TestRatingBadge({ rating }: { rating: string }) {
  const style =
    rating === "Sehr gut"
      ? "bg-emerald-100 text-emerald-800"
      : rating === "Gut"
      ? "bg-lime-100 text-lime-800"
      : rating === "Okay"
      ? "bg-amber-100 text-amber-800"
      : rating === "Problem"
      ? "bg-orange-100 text-orange-800"
      : "bg-red-100 text-red-800";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {rating}
    </span>
  );
}
