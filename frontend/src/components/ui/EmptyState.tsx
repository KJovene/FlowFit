interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return <div className="text-center py-12 text-neutral-400">{message}</div>;
};
