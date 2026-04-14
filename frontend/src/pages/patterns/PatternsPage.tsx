import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { usePatterns } from "@/hooks/usePatterns";
import type { PatternResult, PatternType } from "@/services/patterns.service";

// ── Prompt content ────────────────────────────────────────────────────────────

const PROMPT_CONTENT: Record<PatternType, {
  heading: string;
  body:    string;
  accent:  string;
}> = {
  low_mood: {
    heading: "Your mood has been low recently",
    body:    "We've noticed your mood has been low across several days this week. This is worth taking note of. It can really help to talk to someone you trust — a friend, family member, or your CAMHS support worker. You might also find some of the resources in the app useful.",
    accent:  "border-l-calm-lavender",
  },
  high_anxiety: {
    heading: "Anxiety has been high recently",
    body:    "Anxiety has been running high for you lately. That can feel really difficult to manage. There are things that can help — take a look at the anxiety resources, or speak to your CAMHS worker or another trusted adult when you can.",
    accent:  "border-l-calm-sand",
  },
  distress_emotions: {
    heading: "You've been experiencing some difficult emotions",
    body:    "You've been selecting some of the harder emotions in your check-ins recently. You don't have to manage these alone. Speaking to your CAMHS worker, a trusted adult, or contacting a support line can make a real difference.",
    accent:  "border-l-calm-teal",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PatternsPage() {
  const { data, status, triggered } = usePatterns();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">Patterns</h1>
        <p className="mt-xs text-body text-muted-foreground">
          Based on your recent check-ins. This is to help you notice trends — it is not a diagnosis.
        </p>
      </header>

      {status === "loading" && <LoadingState label="Checking your recent data…" />}
      {status === "error" && (
        <ErrorState
          message="We couldn't load your patterns right now. Please try again."
          onRetry={() => navigate(0)}
        />
      )}

      {status === "success" && (
        <div className="max-w-content space-y-lg">

          {triggered.length === 0 && data.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-lg">
              <p className="text-body font-medium text-foreground">
                No patterns to flag this week
              </p>
              <p className="mt-xs text-caption text-muted-foreground">
                Keep checking in regularly to build up a picture of how you're doing over time.
              </p>
            </div>
          )}

          {triggered.length === 0 && data.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-lg">
              <p className="text-body font-medium text-foreground">
                Not enough data yet
              </p>
              <p className="mt-xs text-caption text-muted-foreground">
                Complete a few mood check-ins and patterns will start to appear here.
              </p>
              <Button onClick={() => navigate("/check-in")} variant="outline" className="mt-md">
                Start a check-in
              </Button>
            </div>
          )}

          {triggered.map((pattern) => (
            <PatternCard key={pattern.type} pattern={pattern} />
          ))}

          {/* All-clear summary when some were checked but none triggered */}
          {triggered.length === 0 && data.length > 0 && (
            <CheckInSummary patterns={data} />
          )}
        </div>
      )}
    </AppLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PatternCard({ pattern }: { pattern: PatternResult }) {
  const content = PROMPT_CONTENT[pattern.type];
  return (
    <div
      className={`rounded-xl border border-border bg-card p-lg border-l-4 ${content.accent}`}
      role="alert"
      aria-label={content.heading}
    >
      <h2 className="text-body font-semibold text-foreground">{content.heading}</h2>
      <p className="mt-sm text-body text-muted-foreground leading-relaxed">{content.body}</p>
      <div className="mt-md flex flex-wrap gap-sm">
        <Button variant="outline" size="sm" asChild>
          <a href="/support">Find support</a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="/resources">Browse resources</a>
        </Button>
      </div>
    </div>
  );
}


function CheckInSummary({ patterns }: { patterns: PatternResult[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-lg">
      <h2 className="text-body font-semibold text-foreground mb-md">This week at a glance</h2>
      <ul className="space-y-sm">
        {patterns.map((p) => {
          const labels: Record<PatternType, string> = {
            low_mood:          "Days with low mood",
            high_anxiety:      "Days with high anxiety",
            distress_emotions: "Distress emotion occurrences",
          };
          return (
            <li key={p.type} className="flex justify-between text-caption">
              <span className="text-muted-foreground">{labels[p.type]}</span>
              <span className="font-medium text-foreground">{p.count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
