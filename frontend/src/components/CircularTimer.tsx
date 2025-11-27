import { cn } from "@/lib/utils";

interface CircularTimerProps {
  duration: number;
  timeRemaining: number;
  isPaused: boolean;
  size?: number;
  variant?: "exercise" | "rest" | "countdown";
  hideText?: boolean;
}

export function CircularTimer({
  duration,
  timeRemaining,
  isPaused,
  size = 280,
  variant = "exercise",
  hideText = false,
}: CircularTimerProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = duration > 0 ? timeRemaining / duration : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getColors = () => {
    switch (variant) {
      case "exercise":
        return {
          track: "stroke-neutral-800",
          progress: "stroke-sky-500",
          glow: "drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]",
        };
      case "rest":
        return {
          track: "stroke-neutral-800",
          progress: "stroke-cyan-400",
          glow: "drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]",
        };
      case "countdown":
        return {
          track: "stroke-neutral-800",
          progress: "stroke-neutral-400",
          glow: "drop-shadow-[0_0_8px_rgba(163,163,163,0.3)]",
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox="0 0 100 100"
      >
        {/* Cercle de fond */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="5"
          className={colors.track}
        />

        {/* Cercle de progression */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          className={cn(
            colors.progress,
            !isPaused && "transition-all duration-1000 ease-linear"
          )}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>

      {/* Texte central */}
      {!hideText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl sm:text-6xl font-bold text-neutral-50 tabular-nums">
            {variant === "countdown"
              ? timeRemaining
              : formatTime(timeRemaining)}
          </div>
          {isPaused && (
            <div className="text-sm text-neutral-400 mt-2 animate-pulse">
              En pause
            </div>
          )}
        </div>
      )}
    </div>
  );
}
