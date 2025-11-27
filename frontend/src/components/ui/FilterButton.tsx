import { cn } from "@/lib/utils";

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: "sky" | "red" | "blue" | "green" | "purple" | "amber" | "cyan";
}

export const FilterButton = ({
  active,
  onClick,
  children,
  color = "sky",
}: FilterButtonProps) => {
  const colorClasses = {
    sky: "bg-sky-500 text-neutral-950",
    red: "bg-red-500 text-neutral-950",
    blue: "bg-blue-500 text-neutral-950",
    green: "bg-green-500 text-neutral-950",
    purple: "bg-purple-400 text-neutral-950",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
        active
          ? colorClasses[color]
          : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
      )}
    >
      {children}
    </button>
  );
};
