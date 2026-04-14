import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResourceList } from "@/hooks/useResources";
import { ResourceCategory, ResourceSection, UserRole } from "shared/types/enums";
import { CATEGORY_META } from "@/components/resources/CategoryCard";
import type { ResourceWithVisibility } from "shared/types/database";
import { Search, X } from "lucide-react";
import { useAuth } from "@/app/AuthContext";

const VALID_CATEGORIES = Object.values(ResourceCategory) as string[];
const RESTRICTED_ROLES: string[] = [UserRole.YoungPerson, UserRole.ParentCarer];

function isAllowed(role: string, manualType: string | null, category: string): boolean {
  if (!RESTRICTED_ROLES.includes(role)) return true;
  if (category === ResourceCategory.Sleep) return true;
  return manualType === category;
}

export default function ResourceCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { user } = useAuth();

  if (!category || !VALID_CATEGORIES.includes(category)) {
    navigate("/resources", { replace: true });
    return null;
  }

  if (user && !isAllowed(user.role, user.manual_type, category)) {
    navigate("/resources", { replace: true });
    return null;
  }

  const cat = category as ResourceCategory;
  const meta = CATEGORY_META[cat];

  const learnResources = useResourceList({ category: cat, section: ResourceSection.Learn });
  const activityResources = useResourceList({ category: cat, section: ResourceSection.Activities });

  const q = query.trim().toLowerCase();

  const filteredLearn = useMemo(() =>
    q
      ? learnResources.data.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        )
      : learnResources.data,
    [learnResources.data, q]
  );

  const filteredActivities = useMemo(() =>
    q
      ? activityResources.data.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        )
      : activityResources.data,
    [activityResources.data, q]
  );

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/resources")}
          className="text-muted-foreground -ml-sm"
        >
          ← Resources
        </Button>
      </nav>

      <header className="mb-xl">
        <span className="text-3xl" aria-hidden="true">{meta.emoji}</span>
        <h1 className="mt-sm text-h2 text-foreground">{meta.label}</h1>
        <p className="mt-xs text-body text-muted-foreground">{meta.description}</p>
      </header>

      {/* Area description */}
      <div className="mb-lg rounded-xl border border-border bg-muted/40 px-md py-sm space-y-xs">
        <p className="text-caption text-foreground">
          <span className="font-semibold">Learn</span>
          {" "}— Short guides explaining what each session covers and the thinking behind it.
        </p>
        <p className="text-caption text-foreground">
          <span className="font-semibold">Activities</span>
          {" "}— Worksheets to work through between sessions. Your practitioner will let you know which ones to focus on.
        </p>
        <p className="text-caption text-muted-foreground">
          This is where you can read about each part of your programme and find worksheets to complete between sessions.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search resources…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
          aria-label="Search resources"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Learn / Activities tabs */}
      <Tabs defaultValue={ResourceSection.Learn}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value={ResourceSection.Learn} className="flex-1 sm:flex-none">
            Learn
          </TabsTrigger>
          <TabsTrigger value={ResourceSection.Activities} className="flex-1 sm:flex-none">
            Activities
          </TabsTrigger>
        </TabsList>

        {/* Learn tab */}
        <TabsContent value={ResourceSection.Learn} className="mt-lg">
          <SectionContent
            resources={filteredLearn}
            status={learnResources.status}
            isFiltered={!!q}
            emptyTitle={q ? "No results" : "No learning resources yet"}
            emptyDescription={
              q
                ? `Nothing matched "${query}". Try a different word.`
                : "Resources for this section will appear here once they're published."
            }
          />
        </TabsContent>

        {/* Activities tab */}
        <TabsContent value={ResourceSection.Activities} className="mt-lg">
          <SectionContent
            resources={filteredActivities}
            status={activityResources.status}
            isFiltered={!!q}
            emptyTitle={q ? "No results" : "No activities yet"}
            emptyDescription={
              q
                ? `Nothing matched "${query}". Try a different word.`
                : "Activities and worksheets will appear here once they're published."
            }
          />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

// ── Video embed (expandable thumbnail) ───────────────────────────────────────

function VideoEmbed({ resource }: { resource: ResourceWithVisibility }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[resource.category as ResourceCategory];

  if (!resource.video_url) return null;
  if (!resource.video_url.startsWith("https://www.youtube-nocookie.com/embed/")) return null;

  const videoId = resource.video_url.replace("https://www.youtube-nocookie.com/embed/", "").split("?")[0];
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  if (expanded) {
    return (
      <div className="mt-sm space-y-xs">
        <div
          className="relative overflow-hidden rounded-xl border border-border bg-black"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src={resource.video_url}
            title={resource.video_label ?? resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-[11px] transition-colors"
          style={{ color: meta?.textColor ?? "#4F7CAC" }}
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
        className="group flex items-center gap-sm rounded-lg border overflow-hidden transition-colors text-left w-full"
        style={{
          borderColor: meta?.topBorder ? `${meta.topBorder}40` : "hsl(var(--border))",
          backgroundColor: meta?.iconBg ?? "hsl(var(--card))",
        }}
        aria-label={resource.video_label ?? "Watch video"}
      >
        <div className="relative flex-shrink-0 w-28 h-16 bg-black overflow-hidden">
          <img
            src={thumbnail}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white text-xs">
              ▶
            </span>
          </div>
        </div>
        <span
          className="px-sm pr-md text-caption text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 flex-1"
        >
          {resource.video_label ?? "Watch video"}
        </span>
        <span
          className="pr-sm text-xs font-semibold flex-shrink-0"
          style={{ color: meta?.textColor ?? "#4F7CAC" }}
        >
          Watch
        </span>
      </button>
    </div>
  );
}

// ── Section content list ──────────────────────────────────────────────────────

function SectionContent({
  resources,
  status,
  isFiltered,
  emptyTitle,
  emptyDescription,
}: {
  resources: ReturnType<typeof useResourceList>["data"];
  status: ReturnType<typeof useResourceList>["status"];
  isFiltered: boolean;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (status === "loading") return <LoadingState label="Loading resources…" />;
  if (status === "error") return <ErrorState message="We couldn't load these resources right now. Please try again." />;
  if (resources.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <>
      {isFiltered && (
        <p className="mb-md text-caption text-muted-foreground">
          {resources.length} result{resources.length !== 1 ? "s" : ""}
        </p>
      )}
      <ul className="flex flex-col gap-md" role="list">
        {resources.map((r) => {
          const rMeta = CATEGORY_META[r.category as ResourceCategory];
          return r.video_url ? (
            <li
              key={r.id}
              className="rounded-xl border shadow-sm overflow-hidden"
              style={{ borderColor: rMeta?.topBorder ? `${rMeta.topBorder}40` : undefined }}
            >
              <ResourceCard
                resource={r}
                className="rounded-none border-0 shadow-none hover:shadow-none"
              />
              <div
                className="border-t px-lg pb-md pt-sm"
                style={{
                  borderColor: rMeta?.topBorder ? `${rMeta.topBorder}30` : undefined,
                  backgroundColor: rMeta?.iconBg ?? "hsl(var(--muted) / 0.3)",
                }}
              >
                <VideoEmbed resource={r} />
              </div>
            </li>
          ) : (
            <li key={r.id}>
              <ResourceCard resource={r} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
