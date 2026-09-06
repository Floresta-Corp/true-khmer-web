import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

interface StarRatingProps {
  /** 0–5; halves round up to a filled star. */
  value: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({
  value,
  className,
  starClassName,
}: StarRatingProps) {
  const filled = Math.round(value);

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((position) => (
        <Star
          key={position}
          aria-hidden
          className={cn(
            "size-3.5",
            position <= filled
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200",
            starClassName,
          )}
        />
      ))}
    </div>
  );
}
