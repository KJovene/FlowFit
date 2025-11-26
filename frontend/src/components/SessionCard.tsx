import { cn } from "@/lib/utils";
import { StarRating } from "./StarRating";
import { User, Heart } from "lucide-react";

interface SessionCardProps {
  title: string;
  exerciseCount: number;
  category: "Musculation" | "Yoga" | "Mobilité" | "Mixte";
  equipment?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  rating?: number;
  ratingCount?: number;
  createdBy?: string;
  creatorProfileImage?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  showFavoriteButton?: boolean;
}

const categoryColors = {
  Musculation: {
    bg: "from-red-500/25 via-red-500/20 to-neutral-950",
    border: "border-red-500/40",
    text: "text-red-100",
    badge: "bg-neutral-950/40",
  },
  Yoga: {
    bg: "from-blue-500/25 via-blue-500/20 to-neutral-950",
    border: "border-blue-500/40",
    text: "text-blue-100",
    badge: "bg-neutral-950/40",
  },
  Mobilité: {
    bg: "from-green-500/25 via-green-500/20 to-neutral-950",
    border: "border-green-500/40",
    text: "text-green-100",
    badge: "bg-neutral-950/40",
  },
  Mixte: {
    bg: "from-purple-500/25 via-pink-500/20 to-neutral-950",
    border: "border-purple-500/40",
    text: "text-purple-100",
    badge: "bg-neutral-950/40",
  },
};

export function SessionCard({
  title,
  exerciseCount,
  category,
  equipment,
  isActive,
  onClick,
  className,
  rating = 0,
  ratingCount = 0,
  createdBy,
  creatorProfileImage,
  isFavorite = false,
  onFavoriteToggle,
  showFavoriteButton = false,
}: SessionCardProps) {
  const colors = categoryColors[category];

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl bg-gradient-to-br border p-3 cursor-pointer transition-all duration-300 hover:scale-[1.02] relative",
        colors.bg,
        colors.border,
        isActive && "ring-2 ring-sky-400",
        className
      )}
    >
      {showFavoriteButton && onFavoriteToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(e);
          }}
          className={cn(
            "absolute top-3 right-3 p-1.5 rounded-full transition-all duration-300 z-10",
            isFavorite
              ? "bg-red-500/30 text-red-400 hover:bg-red-500/40"
              : "bg-neutral-900/50 text-neutral-400 hover:bg-neutral-800/70 hover:text-red-400"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
      )}
      <div className="flex items-center justify-between mb-1">
        <span className={cn("text-[0.7rem]", colors.text)}>{category}</span>
        <span
          className={cn(
            "text-[0.65rem] rounded-full px-2 py-0.5",
            colors.text,
            colors.badge
          )}
        >
          {exerciseCount} {exerciseCount > 1 ? "exercices" : "exercice"}
        </span>
      </div>
      <p className="text-sm font-medium tracking-tight text-neutral-50 mb-1.5">
        {title}
      </p>
      {equipment && (
        <p className="text-xs text-neutral-300 mb-2">{equipment}</p>
      )}

      <div className="flex items-center justify-between gap-2 mt-2">
        <StarRating rating={rating} ratingCount={ratingCount} size="sm" />
        {createdBy && (
          <div className="flex items-center gap-1 text-[0.65rem] text-neutral-400">
            {creatorProfileImage ? (
              <img
                src={`http://localhost:4000${creatorProfileImage}`}
                alt={createdBy}
                className="w-3 h-3 rounded-full object-cover"
              />
            ) : (
              <User className="w-3 h-3" />
            )}
            <span>{createdBy}</span>
          </div>
        )}
      </div>
    </div>
  );
}
