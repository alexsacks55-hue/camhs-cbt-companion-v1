import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
  /** Optional visual accent stripe — uses a CSS class name for the colour. */
  accent?: "blue" | "teal" | "sand" | "lavender";
  className?: string;
}

const ACCENT_CLASSES: Record<NonNullable<DashboardCardProps["accent"]>, string> = {
  blue:     "border-l-4 border-l-calm-blue",
  teal:     "border-l-4 border-l-calm-teal",
  sand:     "border-l-4 border-l-calm-sand",
  lavender: "border-l-4 border-l-calm-lavender",
};

/**
 * Calm content card used on dashboards and overview pages.
 * Soft shadow, rounded corners, generous padding — per design-guidelines.md.
 */
export function DashboardCard({
  title,
  description,
  linkTo,
  linkLabel,
  accent,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-lg shadow-sm",
        "transition-shadow duration-micro hover:shadow-md",
        accent && ACCENT_CLASSES[accent],
        className
      )}
    >
      <h2 className="text-body font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-xs text-caption text-muted-foreground">{description}</p>
      )}
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="mt-md inline-flex items-center text-caption font-medium text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring rounded"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
