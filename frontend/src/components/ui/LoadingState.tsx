interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({
  message = "Chargement...",
}: LoadingStateProps) => {
  return <div className="text-center py-12 text-neutral-400">{message}</div>;
};
