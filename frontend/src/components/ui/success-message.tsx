import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  /** Calm, first-person confirmation copy. */
  message: string;
  className?: string;
}

/**
 * Inline success confirmation — used after completing an action.
 * Per design-guidelines.md example: "Thanks for checking in today."
 * Gentle, not celebratory.
 */
export function SuccessMessage({ message, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-md rounded-lg border border-status-success/30",
        "bg-status-success/10 px-lg py-md",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className="text-status-success" aria-hidden="true">✓</span>
      <p className="text-body text-foreground">{message}</p>
    </div>
  );
}
