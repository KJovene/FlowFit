import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  description: string;
  category: "musculation" | "yoga" | "mobility";
  icon: LucideIcon;
  sessionCount: string;
  items: string[];
  onOpen?: () => void;
  className?: string;
}

const categoryConfig = {
  musculation: {
    bgGradient: "from-sky-500/20 via-blue-500/5 to-transparent",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-300",
    badgeBg: "bg-sky-500/10",
    badgeText: "text-sky-300",
    buttonText: "text-sky-300",
  },
  yoga: {
    bgGradient: "from-cyan-400/20 via-sky-500/5 to-transparent",
    iconBg: "bg-cyan-400/20",
    iconColor: "text-cyan-200",
    badgeBg: "bg-cyan-400/10",
    badgeText: "text-cyan-200",
    buttonText: "text-cyan-200",
  },
  mobility: {
    bgGradient: "from-blue-400/20 via-sky-400/5 to-transparent",
    iconBg: "bg-blue-400/20",
    iconColor: "text-blue-200",
    badgeBg: "bg-blue-400/10",
    badgeText: "text-blue-200",
    buttonText: "text-blue-200",
  },
};

export function WorkoutCard({
  title,
  description,
  category,
  icon: Icon,
  sessionCount,
  items,
  onOpen,
  className,
}: WorkoutCardProps) {
  const config = categoryConfig[category];

  return (
    <article
      className={cn(
        "relative rounded-3xl border border-neutral-800/90 bg-gradient-to-br from-slate-900/90 via-neutral-950 to-neutral-950 overflow-hidden p-4 sm:p-5 card-hover",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-tr pointer-events-none",
          config.bgGradient
        )}
      ></div>

      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-8 w-8 rounded-2xl flex items-center justify-center",
                config.iconBg
              )}
            >
              <Icon className={cn("w-4 h-4 stroke-[1.5]", config.iconColor)} />
            </div>
            <div>
              <h3 className="text-sm font-medium tracking-tight text-neutral-50">
                {title}
              </h3>
              <p className="text-xs text-neutral-400">{description}</p>
            </div>
          </div>
          <span
            className={cn(
              "text-[0.7rem] rounded-full px-2 py-0.5",
              config.badgeBg,
              config.badgeText
            )}
          >
            {sessionCount}
          </span>
        </div>

        <ul className="text-sm text-neutral-300 space-y-1.5">
          {items.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>

        <button
          onClick={onOpen}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs mt-1 transition-colors",
            config.buttonText
          )}
        >
          Ouvrir l'espace
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
