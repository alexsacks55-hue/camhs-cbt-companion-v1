import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buildRoute } from "@/config/routes";
import type { ResourceWithVisibility } from "shared/types/database";
import { ExportType, JourneyStep, ResourceCategory } from "shared/types/enums";
import { CATEGORY_META } from "@/components/resources/CategoryCard";

const JOURNEY_LABELS: Record<JourneyStep, string> = {
  [JourneyStep.Understand]: "Understand",
  [JourneyStep.TryIt]: "Try it",
  [JourneyStep.Practise]: "Practise",
  [JourneyStep.Review]: "Review",
};

const CONTENT_TYPE_ICONS: Record<string, string> = {
  text: "📄",
  pdf: "📋",
  audio: "🔊",
  video: "▶️",
  worksheet: "📝",
};

interface ResourceCardProps {
  resource: ResourceWithVisibility;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const icon = CONTENT_TYPE_ICONS[resource.content_type] ?? "📄";
  const hasExport = resource.export_type !== ExportType.None;
  const meta = CATEGORY_META[resource.category as ResourceCategory];

  return (
    <Link
      to={buildRoute.resourceDetail(resource.id)}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br p-lg shadow-card",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
        meta?.gradient ?? "from-muted/20 to-transparent",
        className
      )}
    >
      {/* Thin top colour stripe */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-0.5"
        style={{ backgroundColor: meta?.topBorder ?? "#4F7CAC" }}
      />

      <div className="flex items-start gap-md">
        {/* Icon in category-tinted circle */}
        <div
          className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg"
          style={{ backgroundColor: meta?.iconBg ?? "rgba(79,124,172,0.14)" }}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          {resource.typical_session != null && (
            <p
              className="mb-xs text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: meta?.textColor ?? "#4F7CAC" }}
            >
              Session {resource.typical_session}
            </p>
          )}
          <h3 className="text-body font-semibold text-foreground leading-snug">
            {resource.title}
          </h3>
          <p className="mt-xs line-clamp-2 text-caption text-muted-foreground leading-relaxed">
            {resource.description}
          </p>
          {(resource.journey_step || hasExport) && (
            <div className="mt-sm flex flex-wrap gap-xs">
              {resource.journey_step && (
                <Badge variant="secondary" className="text-[10px]">
                  {JOURNEY_LABELS[resource.journey_step as JourneyStep]}
                </Badge>
              )}
              {hasExport && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Printable
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Arrow */}
        <span
          aria-hidden="true"
          className="mt-1 flex-shrink-0 text-body font-medium transition-transform duration-150 group-hover:translate-x-1"
          style={{ color: meta?.textColor ?? "#4F7CAC" }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
