import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton = ({ onClick, label = "Retour" }: BackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
};
