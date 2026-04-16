import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useAdminResourceList } from "@/hooks/useResources";
import { resourcesApi } from "@/services/resources.service";
import { ResourceStatus, ResourceCategory } from "shared/types/enums";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<ResourceStatus, { label: string; className: string }> = {
  [ResourceStatus.Published]: { label: "Published", className: "bg-status-success/15 text-status-success border-status-success/30" },
  [ResourceStatus.Draft]:     { label: "Draft",     className: "bg-muted text-muted-foreground" },
  [ResourceStatus.Hidden]:    { label: "Hidden",    className: "bg-status-warning/20 text-foreground border-calm-sand/40" },
  [ResourceStatus.Archived]:  { label: "Archived",  className: "bg-muted/50 text-muted-foreground line-through" },
};

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  [ResourceCategory.Anxiety]:               "Anxiety",
  [ResourceCategory.LowMood]:               "Low Mood",
  [ResourceCategory.BehaviouralChallenges]: "Behavioural Challenges",
  [ResourceCategory.Sleep]:                 "Sleep",
};

export default function AdminResourcesPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const { data: resources, status, reload } = useAdminResourceList({
    status: filterStatus === "all" ? undefined : filterStatus,
    category: filterCategory === "all" ? undefined : filterCategory,
  });

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await resourcesApi.delete(id);
      reload();
    } catch {
      alert("We couldn't delete this resource. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  async function handleQuickStatus(id: string, newStatus: ResourceStatus) {
    try {
      await resourcesApi.update(id, { status: newStatus });
      reload();
    } catch {
      alert("We couldn't update the status. Please try again.");
    }
  }

  return (
    <AppLayout>
      <div className="flex items-start justify-between gap-md flex-wrap">
        <header>
          <h1 className="text-h2 text-foreground">Content Management</h1>
          <p className="mt-xs text-caption text-muted-foreground">
            Add, edit, and publish resources. Changes take effect immediately.
          </p>
        </header>
        <Button asChild>
          <Link to="/admin/resources/new">+ Add resource</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-lg flex flex-wrap gap-sm">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(ResourceStatus).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_BADGE[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.values(ResourceCategory).map((c) => (
              <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="mt-lg">
        {status === "loading" && <LoadingState label="Loading resources…" />}
        {status === "error" && (
          <ErrorState message="We couldn't load resources right now." onRetry={reload} />
        )}
        {status === "success" && resources.length === 0 && (
          <EmptyState
            title="No resources yet"
            description="Add your first resource using the button above."
          />
        )}
        {status === "success" && resources.length > 0 && (
          <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card" role="list">
            {resources.map((r) => {
              const badge = STATUS_BADGE[r.status as ResourceStatus];
              return (
                <li key={r.id} className="flex items-start gap-md p-md">
                  {/* Sort order */}
                  <span className="w-6 flex-shrink-0 pt-0.5 text-center text-caption text-muted-foreground">
                    {r.sort_order}
                  </span>

                  {/* Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-xs">
                      <span className="text-body font-medium text-foreground truncate">
                        {r.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", badge.className)}
                      >
                        {badge.label}
                      </Badge>
                    </div>
                    <p className="mt-xs text-caption text-muted-foreground">
                      {CATEGORY_LABELS[r.category as ResourceCategory]} ·{" "}
                      {r.section === "learn" ? "Learn" : "Activity"} ·{" "}
                      Sort #{r.sort_order}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 items-center gap-xs">
                    {r.status !== ResourceStatus.Published && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-caption text-status-success"
                        onClick={() => handleQuickStatus(r.id, ResourceStatus.Published)}
                      >
                        Publish
                      </Button>
                    )}
                    {r.status === ResourceStatus.Published && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-caption"
                        onClick={() => handleQuickStatus(r.id, ResourceStatus.Hidden)}
                      >
                        Hide
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-caption"
                      onClick={() => navigate(`/admin/resources/${r.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-caption text-destructive"
                      disabled={deleting === r.id}
                      onClick={() => handleDelete(r.id, r.title)}
                    >
                      {deleting === r.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
