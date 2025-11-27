import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // note moyenne entre 0 et 5
  ratingCount?: number; // nombre de votes
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  ratingCount,
  size = "sm",
  showCount = true,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  const handleClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              disabled={!interactive}
              className={cn(
                "transition-colors",
                interactive && "hover:scale-110 cursor-pointer",
                !interactive && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-all",
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-neutral-700 text-neutral-700"
                )}
              />
            </button>
          );
        })}
      </div>
      {showCount && ratingCount !== undefined && (
        <span className={cn("text-neutral-400 ml-1", textSizeClasses[size])}>
          ({ratingCount})
        </span>
      )}
    </div>
  );
}
