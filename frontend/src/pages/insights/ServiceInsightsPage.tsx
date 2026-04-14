import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useInsights } from "@/hooks/useInsights";
import type { UsagePeriod } from "@/services/insights.service";
import { cn } from "@/lib/utils";

export default function ServiceInsightsPage() {
  const { data, status } = useInsights();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">Service Insights</h1>
        <p className="mt-xs text-caption text-muted-foreground">
          Anonymous, aggregated usage data. No individual user data is shown.
        </p>
      </header>

      {status === "loading" && <LoadingState label="Loading insights…" />}
      {status === "error" && (
        <ErrorState
          message="We couldn't load service insights right now. Please try again."
          onRetry={() => navigate(0)}
        />
      )}
      {status === "success" && data && (
        <div className="space-y-xl max-w-content">
          <UsageSection title="Daily Usage" subtitle="Last 24 hours" period={data.daily} />
          <UsageSection title="Weekly Usage" subtitle="Last 7 days" period={data.weekly} />
          <UsageSection title="Monthly Usage" subtitle="Last 30 days" period={data.monthly} />
        </div>
      )}
    </AppLayout>
  );
}

function UsageSection({
  title,
  subtitle,
  period,
}: {
  title: string;
  subtitle: string;
  period: UsagePeriod;
}) {
  return (
    <section aria-label={title}>
      <div className="mb-md">
        <h2 className="text-h3 text-foreground">{title}</h2>
        <p className="text-caption text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-3 gap-md">
        <StatCard label="App uses" value={period.app_uses} accent="blue" />
        <StatCard label="Resources opened" value={period.resource_opens} accent="teal" />
        <StatCard label="Check-ins completed" value={period.checkins} accent="lavender" />
      </div>
    </section>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  const styles: Record<string, { border: string; bg: string; numColor: string }> = {
    blue:     { border: "border-l-calm-blue",     bg: "from-calm-blue/10 to-transparent",     numColor: "#2B5F8A" },
    teal:     { border: "border-l-calm-teal",     bg: "from-calm-teal/10 to-transparent",     numColor: "#3D7A5E" },
    lavender: { border: "border-l-calm-lavender", bg: "from-calm-lavender/10 to-transparent", numColor: "#5B4A8E" },
  };
  const s = styles[accent] ?? { border: "border-l-primary", bg: "from-primary/10 to-transparent", numColor: "#003087" };
  return (
    <div className={cn(
      "rounded-xl border border-border bg-gradient-to-br p-md border-l-4 shadow-card",
      s.border, s.bg,
    )}>
      <p className="text-caption font-medium text-muted-foreground">{label}</p>
      <p className="text-h2 font-bold mt-xs" style={{ color: s.numColor }}>{value}</p>
    </div>
  );
}
