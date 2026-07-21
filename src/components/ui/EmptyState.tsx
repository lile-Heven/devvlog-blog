import { FileText } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "No posts found",
  description = "Check back later for new content.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface border border-surface-border flex items-center justify-center mb-4 text-ink-muted">
        {icon ?? <FileText className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-display font-semibold text-ink-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-ink-muted max-w-sm">{description}</p>
    </div>
  );
}
