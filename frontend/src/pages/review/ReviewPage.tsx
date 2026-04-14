import type React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useWeeklyReview } from "@/hooks/useReview";
import { useRecentCheckins } from "@/hooks/useCheckins";
import { usePatterns } from "@/hooks/usePatterns";
import type { DBMoodCheckin } from "shared/types/database";
import type { PatternResult, PatternType } from "@/services/patterns.service";
import { cn } from "@/lib/utils";

// ── Pattern summary builder ───────────────────────────────────────────────────

const PATTERN_PHRASES: Record<PatternType, string> = {
  low_mood:          "your mood has been low",
  high_anxiety:      "anxiety has been high",
  distress_emotions: "you've been experiencing some difficult emotions",
};

function buildPatternSummary(triggered: PatternResult[]): string {
  const phrases = triggered.map((p) => PATTERN_PHRASES[p.type]);
  if (phrases.length === 1) return `This week ${phrases[0]}.`;
  const last = phrases.pop();
  return `This week ${phrases.join(", ")} and ${last}.`;
}

// ── Label maps ────────────────────────────────────────────────────────────────

const EMOTION_LABELS: Record<string, string> = {
  calm: "Calm", worried: "Worried", sad: "Sad", angry: "Angry",
  overwhelmed: "Overwhelmed", hopeful: "Hopeful", tired: "Tired",
  frustrated: "Frustrated", okay: "Okay", very_worried: "Very worried",
  hopeless: "Hopeless",
};

const CONTEXT_LABELS: Record<string, string> = {
  school: "School", friends: "Friends", family: "Family", sleep: "Sleep",
  health: "Health", activities: "Activities", home: "Home", not_sure: "Not sure",
};

const STRATEGY_LABELS: Record<string, string> = {
  breathing: "Breathing exercises", going_outside: "Going outside",
  talking_to_someone: "Talking to someone", grounding: "Grounding",
  listening_to_music: "Listening to music", taking_a_break: "Taking a break",
  movement: "Movement", routine: "Routine",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const { data: review, status: reviewStatus } = useWeeklyReview();
  const { data: checkins, status: checkinsStatus } = useRecentCheckins(7);
  const { triggered } = usePatterns();
  const navigate = useNavigate();

  const loading = reviewStatus === "loading" || checkinsStatus === "loading";
  const error = reviewStatus === "error" || checkinsStatus === "error";
  const ready = reviewStatus === "success" && checkinsStatus === "success";
  const empty = ready && (review?.checkins_completed ?? 0) === 0;

  return (
    <AppLayout>
      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">Review</h1>
        <p className="mt-xs text-body text-muted-foreground">
          A summary of how you've been getting on recently.
        </p>
      </header>

      {loading && <LoadingState label="Building your review…" />}
      {error && (
        <ErrorState
          message="We couldn't load your review right now. Please try again."
          onRetry={() => navigate(0)}
        />
      )}
      {empty && (
        <EmptyState
          title="No check-ins yet this week"
          description="Complete a mood check-in to start building your weekly review."
          action={
            <Button onClick={() => navigate("/check-in")}>
              Start a check-in
            </Button>
          }
        />
      )}
      {ready && !empty && review && (
        <>
          <ReviewContent review={review} checkins={checkins} triggered={triggered} />

          <div className="mt-xl print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              Print or save summary
            </Button>
            <p className="mt-xs text-caption text-muted-foreground">
              No personal details are included in printed output.
            </p>
          </div>
        </>
      )}
    </AppLayout>
  );
}

// ── Review content ────────────────────────────────────────────────────────────

function ReviewContent({
  review,
  checkins,
  triggered,
}: {
  review: { checkins_completed: number; mood_trend: { date: string; mood: number; anxiety: number }[] };
  checkins: DBMoodCheckin[];
  triggered: PatternResult[];
}) {
  // Average mood across the week
  const avgMood =
    review.mood_trend.length > 0
      ? Math.round((review.mood_trend.reduce((sum, p) => sum + p.mood, 0) / review.mood_trend.length) * 10) / 10
      : null;

  return (
    <div className="space-y-lg max-w-content">

      {/* At-a-glance — check-ins + average mood */}
      <section aria-label="Summary" className="grid grid-cols-2 gap-md">
        <StatCard
          label="Check-ins this week"
          value={review.checkins_completed}
          accent="blue"
        />
        {avgMood !== null && (
          <StatCard
            label="Average mood"
            value={avgMood}
            suffix="/ 10"
            accent="teal"
          />
        )}
      </section>

      {/* Per-day check-in breakdown */}
      {checkins.length > 0 && (
        <section aria-label="Daily check-ins">
          <h2 className="text-h3 text-foreground mb-md">This week's check-ins</h2>
          <div className="space-y-md">
            {checkins.map((c) => (
              <DayRow key={c.id} checkin={c} />
            ))}
          </div>
        </section>
      )}

      {/* Pattern summary */}
      {triggered.length > 0 && (
        <section aria-label="Patterns noticed">
          <div className="rounded-xl border border-border bg-card p-lg">
            <p className="text-body text-foreground leading-relaxed">
              {buildPatternSummary(triggered)}
            </p>
            <p className="mt-xs text-caption text-muted-foreground">
              It might be worth mentioning this to your practitioner.
            </p>
          </div>
        </section>
      )}

      {/* Print-only footer */}
      <div className="hidden print:block mt-xl border-t border-border pt-md">
        <p className="text-caption text-muted-foreground">
          CAMHS CBT Companion — Review of the past 7 days
        </p>
        <p className="text-caption text-muted-foreground">
          This summary contains structured data only. No personal details are included.
        </p>
      </div>
    </div>
  );
}

// ── Day row ───────────────────────────────────────────────────────────────────

function DayRow({ checkin }: { checkin: DBMoodCheckin }) {
  const date = new Date(checkin.created_at);
  const dayName = date.toLocaleDateString("en-GB", { weekday: "long" });
  const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {/* Day header */}
      <div className="flex items-center justify-between px-lg py-sm border-b border-border bg-muted/30">
        <div>
          <span className="text-body font-semibold text-foreground">{dayName}</span>
          <span className="ml-sm text-caption text-muted-foreground">{dateStr}</span>
        </div>
        <div className="flex items-center gap-md">
          <RatingPill label="Mood" value={checkin.mood_rating} />
          <RatingPill label="Anxiety" value={checkin.anxiety_rating} />
        </div>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-border">
        {checkin.emotions.length > 0 && (
          <DetailRow label="Emotions">
            <ChipRow items={checkin.emotions} labels={EMOTION_LABELS} color="lavender" />
          </DetailRow>
        )}
        {checkin.contexts.length > 0 && (
          <DetailRow label="Discussion areas">
            <ChipRow items={checkin.contexts} labels={CONTEXT_LABELS} color="sand" />
          </DetailRow>
        )}
        {checkin.coping_strategies.length > 0 && (
          <DetailRow label="What helped">
            <ChipRow items={checkin.coping_strategies} labels={STRATEGY_LABELS} color="teal" />
          </DetailRow>
        )}
        {checkin.emotions.length === 0 && checkin.contexts.length === 0 && checkin.coping_strategies.length === 0 && (
          <div className="px-lg py-sm">
            <span className="text-caption text-muted-foreground">No additional details recorded.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-xs text-caption">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}<span className="text-muted-foreground font-normal">/10</span></span>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-xs px-lg py-sm sm:flex-row sm:items-start sm:gap-lg">
      <span className="w-36 shrink-0 text-caption font-medium text-muted-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ChipRow({
  items,
  labels,
  color,
}: {
  items: string[];
  labels: Record<string, string>;
  color: "lavender" | "sand" | "teal";
}) {
  const cls = {
    lavender: "bg-calm-lavender/15 text-calm-lavender border-calm-lavender/30",
    sand:     "bg-calm-sand/30 text-foreground border-calm-sand/50",
    teal:     "bg-calm-teal/15 text-calm-teal border-calm-teal/30",
  }[color];

  return (
    <div className="flex flex-wrap gap-xs">
      {items.map((item) => (
        <span key={item} className={cn("rounded-full border px-md py-xs text-caption", cls)}>
          {labels[item] ?? item}
        </span>
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent: "blue" | "teal";
}) {
  const styles = {
    blue: { border: "border-l-calm-blue", bg: "from-calm-blue/10 to-transparent", color: "#2B5F8A" },
    teal: { border: "border-l-calm-teal", bg: "from-calm-teal/10 to-transparent", color: "#3D7A5E" },
  }[accent];

  return (
    <div className={cn(
      "rounded-xl border border-border bg-gradient-to-br p-lg border-l-4 shadow-card",
      styles.border,
      styles.bg,
    )}>
      <p className="text-caption font-medium text-muted-foreground">{label}</p>
      <p className="mt-xs font-bold" style={{ color: styles.color }}>
        <span className="text-h1">{value}</span>
        {suffix && <span className="ml-1 text-body text-muted-foreground font-normal">{suffix}</span>}
      </p>
    </div>
  );
}
