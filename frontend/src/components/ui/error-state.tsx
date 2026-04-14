import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ErrorStateProps {
  /** Plain-language error message. Never technical jargon. */
  message?: string;
  /** Optional retry callback. */
  onRetry?: () => void;
  className?: string;
}

/**
 * Calm error state per design-guidelines.md:
 * "We couldn't load this page right now. Please try again."
 * Never shows stack traces or technical messages to users.
 */
export function ErrorState({
  message = "We couldn't load this right now. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border",
        "bg-background px-xl py-xxl text-center",
        className
      )}
      role="alert"
    >
      <p className="text-body font-medium text-foreground">{message}</p>
      <p className="mt-sm text-caption text-muted-foreground">
        If this keeps happening, please contact your practitioner or support team.
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-lg">
          Try again
        </Button>
      )}
    </div>
  );
}
