import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Primary message — plain English, not clinical. */
  title: string;
  /** Supporting guidance — optional. */
  description?: string;
  /** Optional action button. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Supportive empty state shown when a section has no data yet.
 * Language must be encouraging, never clinical or blank.
 * Per design-guidelines.md: "supportive empty states".
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border",
        "bg-background px-xl py-xxl text-center",
        className
      )}
      role="status"
    >
      <p className="text-body font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-sm max-w-sm text-caption text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-lg">{action}</div>}
    </div>
  );
}
