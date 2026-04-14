import { cn } from "@/lib/utils";

interface LoadingStateProps {
  /** Accessible label for screen readers. */
  label?: string;
  className?: string;
  /** Show inline (no min-height) or full section height. */
  variant?: "inline" | "section";
}

/**
 * Calm loading indicator — no spinners, just a subtle pulse.
 * Used as a skeleton for sections that are fetching data.
 */
export function LoadingState({
  label = "Loading…",
  className,
  variant = "section",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        variant === "section" && "min-h-32 w-full",
        className
      )}
      role="status"
      aria-label={label}
    >
      <div className="flex gap-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-primary/40 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Skeleton shimmer block for content placeholders.
 */
export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-4 w-full animate-pulse rounded bg-muted", className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-lg shadow-sm", className)}>
      <SkeletonLine className="w-1/3" />
      <SkeletonLine className="mt-md w-2/3" />
      <SkeletonLine className="mt-sm w-1/2" />
    </div>
  );
}
