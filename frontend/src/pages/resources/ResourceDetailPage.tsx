import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useResource } from "@/hooks/useResources";
import { resourcesApi } from "@/services/resources.service";
import { ExportType, JourneyStep, ContentType } from "shared/types/enums";
import { buildRoute } from "@/config/routes";

const APP_LINK_META: Record<string, { label: string; description: string }> = {
  "/sleep/diary":     { label: "Open Sleep Diary",           description: "Log your bedtime, wake time, and sleep quality." },
  "/sleep/wind-down": { label: "Open Wind-Down Planner",     description: "Build and save your personal wind-down routine." },
};

const JOURNEY_LABELS: Record<JourneyStep, string> = {
  [JourneyStep.Understand]: "Understand",
  [JourneyStep.TryIt]: "Try it",
  [JourneyStep.Practise]: "Practise",
  [JourneyStep.Review]: "Review",
};

const CATEGORY_LABELS: Record<string, string> = {
  anxiety: "Anxiety",
  low_mood: "Low Mood",
  behavioural_challenges: "Behavioural Challenges",
  sleep: "Sleep",
};

export default function ResourceDetailPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const { data: resource, status } = useResource(resourceId ?? "");

  // Fire analytics on mount — once data is loaded
  useEffect(() => {
    if (resource) {
      resourcesApi.trackView(resource.id, resource.category);
    }
  }, [resource?.id]);

  if (status === "loading") {
    return (
      <AppLayout>
        <LoadingState label="Loading resource…" />
      </AppLayout>
    );
  }

  if (status === "error" || !resource) {
    return (
      <AppLayout>
        <ErrorState
          message="We couldn't load this resource right now. Please try again."
          onRetry={() => navigate(0)}
        />
      </AppLayout>
    );
  }

  const hasExport = resource.export_type !== ExportType.None;

  function handleExport() {
    if (!resource) return;
    resourcesApi.trackExport(resource.id, resource.category);

    if (resource.export_type === ExportType.BlankTemplate && resource.file_url) {
      window.open(resource.file_url, "_blank", "noopener,noreferrer");
    } else {
      // Structured summary export — client-side only, no personal data
      window.print();
    }
  }

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(buildRoute.resourceCategory(resource.category))}
          className="text-muted-foreground -ml-sm"
        >
          ← {CATEGORY_LABELS[resource.category] ?? "Resources"}
        </Button>
      </nav>

      <article className="content-width space-y-lg">
        {/* Header */}
        <header>
          <div className="flex flex-wrap gap-xs">
            <Badge variant="secondary">{CATEGORY_LABELS[resource.category]}</Badge>
            <Badge variant="outline">
              {resource.section === "learn" ? "Learn" : "Activity"}
            </Badge>
            {resource.journey_step && (
              <Badge variant="secondary">
                {JOURNEY_LABELS[resource.journey_step as JourneyStep]}
              </Badge>
            )}
          </div>
          <h1 className="mt-md text-h1 text-foreground">{resource.title}</h1>
          {resource.typical_session && (
            <p className="mt-xs text-caption text-muted-foreground">
              Suggested around session {resource.typical_session}
            </p>
          )}
        </header>

        {/* Video — TOP placement (before body text) */}
        {resource.video_url && resource.video_placement === "top" && (
          <VideoEmbed url={resource.video_url} label={resource.video_label} />
        )}

        {/* Description */}
        <div className="prose-calm text-body text-muted-foreground leading-relaxed">
          <p>{resource.description}</p>
        </div>

        {/* Body text — full Learn content */}
        {resource.body_text && (
          <div className="space-y-md text-body text-foreground leading-relaxed">
            {resource.body_text.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {/* Video — BELOW placement (after body text, before resources/actions) */}
        {resource.video_url && resource.video_placement !== "top" && (
          <VideoEmbed url={resource.video_url} label={resource.video_label} />
        )}

        {/* Content — varies by content_type */}
        <ResourceContent
          contentType={resource.content_type as ContentType}
          fileUrl={resource.file_url}
        />

        {/* External links */}
        {resource.external_links && resource.external_links.length > 0 && (
          <section className="rounded-xl border border-border bg-background p-lg">
            <h2 className="text-body font-semibold text-foreground mb-md">Further reading</h2>
            <ul className="space-y-sm">
              {resource.external_links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption text-primary underline-offset-2 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}


        {/* In-app tool link */}
        {resource.app_link && APP_LINK_META[resource.app_link] && (
          <section className="rounded-xl border border-border bg-background p-lg">
            <h2 className="text-body font-semibold text-foreground">
              {APP_LINK_META[resource.app_link].label}
            </h2>
            <p className="mt-xs text-caption text-muted-foreground">
              {APP_LINK_META[resource.app_link].description}
            </p>
            <Button
              onClick={() => navigate(resource.app_link!)}
              className="mt-md"
              style={{ backgroundColor: "#003087" }}
            >
              {APP_LINK_META[resource.app_link].label}
            </Button>
          </section>
        )}

        {/* Export action */}
        {hasExport && (
          <section className="rounded-xl border border-border bg-background p-lg">
            <h2 className="text-body font-semibold text-foreground">
              {resource.export_type === ExportType.BlankTemplate
                ? "Download template"
                : "Print or save summary"}
            </h2>
            <p className="mt-xs text-caption text-muted-foreground">
              {resource.export_type === ExportType.BlankTemplate
                ? "Download a blank version of this worksheet to print or fill in."
                : "Print a structured summary. No personal details are included."}
            </p>
            <Button onClick={handleExport} variant="outline" className="mt-md">
              {resource.export_type === ExportType.BlankTemplate
                ? "Download worksheet"
                : "Print summary"}
            </Button>
          </section>
        )}
      </article>
    </AppLayout>
  );
}

// ── Video embed ───────────────────────────────────────────────────────────────

function VideoEmbed({ url, label }: { url: string; label?: string | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!url.startsWith("https://www.youtube-nocookie.com/embed/")) return null;

  const videoId = url.replace("https://www.youtube-nocookie.com/embed/", "").split("?")[0];
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  if (expanded) {
    return (
      <div className="space-y-xs">
        {label && <p className="text-caption text-muted-foreground">{label}</p>}
        <div className="relative overflow-hidden rounded-xl border border-border bg-black" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={url}
            title={label ?? "Video resource"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          ▲ Collapse video
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(true)}
        className="group flex items-center gap-sm rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors text-left w-full"
        aria-label={label ?? "Watch video"}
      >
        <div className="relative flex-shrink-0 w-28 h-16 bg-black overflow-hidden">
          <img
            src={thumbnail}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white text-xs group-hover:bg-primary/80 transition-colors">
              ▶
            </span>
          </div>
        </div>
        <span className="px-sm pr-md text-caption text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
          {label ?? "Watch video"}
        </span>
      </button>
    </div>
  );
}

// ── Resource content (PDF / audio / legacy video link) ────────────────────────

function ResourceContent({
  contentType,
  fileUrl,
}: {
  contentType: ContentType;
  fileUrl: string | null;
}) {
  if (contentType === ContentType.Pdf && fileUrl) {
    return (
      <div className="rounded-xl border border-border p-lg">
        <p className="text-caption text-muted-foreground mb-md">
          This resource is available as a PDF.
        </p>
        <Button variant="outline" asChild>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Open PDF
          </a>
        </Button>
      </div>
    );
  }

  if (contentType === ContentType.Audio && fileUrl) {
    return (
      <div className="rounded-xl border border-border p-lg">
        <p className="text-caption text-muted-foreground mb-md">Listen to this resource:</p>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio controls className="w-full" src={fileUrl}>
          Your browser does not support audio. Please{" "}
          <a href={fileUrl} className="text-primary underline">
            download the file
          </a>
          .
        </audio>
      </div>
    );
  }

  if (contentType === ContentType.Video && fileUrl) {
    return (
      <div className="rounded-xl border border-border p-lg">
        <p className="text-caption text-muted-foreground mb-md">Watch this resource:</p>
        <Button variant="outline" asChild>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Watch video
          </a>
        </Button>
      </div>
    );
  }

  // Text / worksheet — content is in description
  return null;
}
