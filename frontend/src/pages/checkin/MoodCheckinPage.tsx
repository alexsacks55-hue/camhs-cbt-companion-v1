import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "@/components/ui/loading-state";
import { checkinsApi } from "@/services/checkins.service";
import { useTodayCheckin } from "@/hooks/useCheckins";
import {
  EMOTION_CHOICES,
  CONTEXT_CHOICES,
  COPING_STRATEGY_CHOICES,
} from "@/config/constants";
import type { EmotionChoice, ContextChoice, CopingChoice } from "@/config/constants";
import { cn } from "@/lib/utils";
import type { DBMoodCheckin } from "shared/types/database";

// ── Label maps ────────────────────────────────────────────────────────────────

const EMOTION_LABELS: Record<EmotionChoice, string> = {
  calm:        "Calm",
  worried:     "Worried",
  sad:         "Sad",
  angry:       "Angry",
  overwhelmed: "Overwhelmed",
  hopeful:     "Hopeful",
  tired:       "Tired",
  frustrated:  "Frustrated",
  okay:        "Okay",
  very_worried: "Very worried",
  hopeless:    "Hopeless",
};

const CONTEXT_LABELS: Record<ContextChoice, string> = {
  school:      "School",
  friends:     "Friends",
  family:      "Family",
  sleep:       "Sleep",
  health:      "Health",
  activities:  "Activities",
  home:        "Home",
  not_sure:    "Not sure",
};

const COPING_LABELS: Record<CopingChoice, string> = {
  breathing:         "Breathing exercises",
  going_outside:     "Going outside",
  talking_to_someone: "Talking to someone",
  grounding:         "Grounding",
  listening_to_music: "Listening to music",
  taking_a_break:    "Taking a break",
  movement:          "Movement",
  routine:           "Routine",
};

// ── Step types ────────────────────────────────────────────────────────────────

type Step = "sliders" | "emotions" | "contexts" | "coping" | "done";

const STEPS: Step[] = ["sliders", "emotions", "contexts", "coping", "done"];

interface FormState {
  mood_rating:       number;
  anxiety_rating:    number;
  emotions:          EmotionChoice[];
  contexts:          ContextChoice[];
  coping_strategies: CopingChoice[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MoodCheckinPage() {
  const navigate = useNavigate();
  const { data: todayCheckin, checkedInToday, status: todayStatus } = useTodayCheckin();

  const [step, setStep] = useState<Step>("sliders");
  const [form, setForm] = useState<FormState>({
    mood_rating:       5,
    anxiety_rating:    5,
    emotions:          [],
    contexts:          [],
    coping_strategies: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<DBMoodCheckin | null>(null);

  const stepIndex = STEPS.indexOf(step);

  // While checking whether today's check-in exists
  if (todayStatus === "loading") {
    return (
      <AppLayout>
        <LoadingState label="Loading…" />
      </AppLayout>
    );
  }

  // Already checked in today — show read-only summary
  if ((checkedInToday && todayCheckin) || submitted) {
    const checkin = submitted ?? todayCheckin!;
    return <TodaySummary checkin={checkin} onNavigate={navigate} />;
  }

  async function handleNext() {
    if (step === "coping") {
      await submit();
    } else {
      setStep(STEPS[stepIndex + 1]);
    }
  }

  function handleBack() {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await checkinsApi.create({
        mood_rating:       form.mood_rating,
        anxiety_rating:    form.anxiety_rating,
        emotions:          form.emotions,
        contexts:          form.contexts,
        coping_strategies: form.coping_strategies,
      });
      setSubmitted(result);
    } catch {
      setError("We couldn't save your check-in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleEmotion(e: EmotionChoice) {
    setForm((f) => ({
      ...f,
      emotions: f.emotions.includes(e)
        ? f.emotions.filter((x) => x !== e)
        : [...f.emotions, e],
    }));
  }

  function toggleContext(c: ContextChoice) {
    setForm((f) => ({
      ...f,
      contexts: f.contexts.includes(c)
        ? f.contexts.filter((x) => x !== c)
        : [...f.contexts, c],
    }));
  }

  function toggleCoping(s: CopingChoice) {
    setForm((f) => ({
      ...f,
      coping_strategies: f.coping_strategies.includes(s)
        ? f.coping_strategies.filter((x) => x !== s)
        : [...f.coping_strategies, s],
    }));
  }

  return (
    <AppLayout>
      {/* Progress indicator */}
      <div className="mb-lg flex gap-xs" aria-hidden="true">
        {STEPS.slice(0, 4).map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-micro",
              i <= stepIndex ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step content */}
      {step === "sliders" && (
        <SlidersStep
          moodRating={form.mood_rating}
          anxietyRating={form.anxiety_rating}
          onMoodChange={(v) => setForm((f) => ({ ...f, mood_rating: v }))}
          onAnxietyChange={(v) => setForm((f) => ({ ...f, anxiety_rating: v }))}
        />
      )}

      {step === "emotions" && (
        <ChipStep
          title="Which emotions describe how you've been feeling?"
          subtitle="Select all that apply. You can skip this if you're not sure."
          chips={[...EMOTION_CHOICES]}
          selected={form.emotions}
          labels={EMOTION_LABELS}
          onToggle={toggleEmotion}
        />
      )}

      {step === "contexts" && (
        <ChipStep
          title="What's been going on for you?"
          subtitle="Select any areas that have felt significant. You can skip this."
          chips={[...CONTEXT_CHOICES]}
          selected={form.contexts}
          labels={CONTEXT_LABELS}
          onToggle={toggleContext}
        />
      )}

      {step === "coping" && (
        <ChipStep
          title="What's been helping?"
          subtitle="Select anything that's been useful recently. You can skip this."
          chips={[...COPING_STRATEGY_CHOICES]}
          selected={form.coping_strategies}
          labels={COPING_LABELS}
          onToggle={toggleCoping}
        />
      )}

      {/* Navigation */}
      <div className="mt-xl flex gap-md">
        <Button
          onClick={handleNext}
          disabled={submitting}
          className="min-w-[120px]"
        >
          {step === "coping"
            ? submitting ? "Saving…" : "Finish"
            : "Next"}
        </Button>
        {stepIndex > 0 && (
          <Button variant="ghost" onClick={handleBack} disabled={submitting}>
            Back
          </Button>
        )}
      </div>
    </AppLayout>
  );
}

// ── Today's summary (shown after completion or if already done today) ─────────

function TodaySummary({
  checkin,
  onNavigate,
}: {
  checkin: DBMoodCheckin;
  onNavigate: (path: string) => void;
}) {
  const isNew = isToday(new Date(checkin.created_at));

  return (
    <AppLayout>
      <div className="mx-auto max-w-content space-y-lg pt-md">
        {/* Header */}
        <header className="flex items-start gap-md">
          <div
            className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: "rgba(107,175,146,0.15)" }}
            aria-hidden="true"
          >
            ✓
          </div>
          <div>
            <h1 className="text-h2 text-foreground">
              {isNew ? "Check-in saved" : "Today's check-in"}
            </h1>
            <p className="mt-xs text-body text-muted-foreground">
              {isNew
                ? "Here's a summary of what you recorded today."
                : "You've already checked in today. Come back tomorrow to check in again."}
            </p>
          </div>
        </header>

        {/* Summary card */}
        <div className="rounded-xl border border-border bg-card shadow-card divide-y divide-border">
          <SummarySection label="Mood">
            <RatingBadge value={checkin.mood_rating} />
          </SummarySection>

          <SummarySection label="Anxiety">
            <RatingBadge value={checkin.anxiety_rating} />
          </SummarySection>

          {checkin.emotions.length > 0 && (
            <SummarySection label="Emotions">
              <ChipDisplay
                items={checkin.emotions}
                labels={EMOTION_LABELS as Record<string, string>}
                color="lavender"
              />
            </SummarySection>
          )}

          {checkin.contexts.length > 0 && (
            <SummarySection label="Discussion areas">
              <ChipDisplay
                items={checkin.contexts}
                labels={CONTEXT_LABELS as Record<string, string>}
                color="sand"
              />
            </SummarySection>
          )}

          {checkin.coping_strategies.length > 0 && (
            <SummarySection label="What's been helping">
              <ChipDisplay
                items={checkin.coping_strategies}
                labels={COPING_LABELS as Record<string, string>}
                color="teal"
              />
            </SummarySection>
          )}
        </div>

        {/* Onward links */}
        <div className="flex flex-col gap-md sm:flex-row">
          <Button onClick={() => onNavigate("/review")}>
            See your past week
          </Button>
          <Button variant="outline" onClick={() => onNavigate("/resources")}>
            Browse resources
          </Button>
          <Button variant="ghost" onClick={() => onNavigate("/home")}>
            Go to home
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function SummarySection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-sm px-lg py-md sm:flex-row sm:items-start sm:gap-xl">
      <span className="w-40 shrink-0 text-caption font-semibold text-muted-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function RatingBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span className="text-h2 font-bold text-primary">{value}</span>
      <span className="text-caption text-muted-foreground">/ 10</span>
    </span>
  );
}

function ChipDisplay({
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

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

// ── Sliders step ──────────────────────────────────────────────────────────────

function SlidersStep({
  moodRating,
  anxietyRating,
  onMoodChange,
  onAnxietyChange,
}: {
  moodRating: number;
  anxietyRating: number;
  onMoodChange: (v: number) => void;
  onAnxietyChange: (v: number) => void;
}) {
  return (
    <div className="space-y-xl">
      <header>
        <h1 className="text-h2 text-foreground">How are you feeling right now?</h1>
        <p className="mt-xs text-body text-muted-foreground">
          Move the sliders to show where you're at today.
        </p>
      </header>

      <SliderField
        label="Mood"
        value={moodRating}
        onChange={onMoodChange}
        lowLabel="Very low"
        highLabel="Really good"
        ariaLabel="Mood rating"
      />

      <SliderField
        label="Anxiety"
        value={anxietyRating}
        onChange={onAnxietyChange}
        lowLabel="Very calm"
        highLabel="Very anxious"
        ariaLabel="Anxiety rating"
      />
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
  ariaLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
  ariaLabel: string;
}) {
  return (
    <div className="space-y-sm rounded-xl border border-border bg-card p-lg">
      <div className="flex items-center justify-between">
        <span className="text-body font-medium text-foreground">{label}</span>
        <span
          className="min-w-[2rem] text-right text-h2 font-semibold text-primary"
          aria-live="polite"
          aria-label={`${ariaLabel}: ${value} out of 10`}
        >
          {value}
        </span>
      </div>
      <Slider
        value={value}
        min={0}
        max={10}
        step={1}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <div className="flex justify-between text-caption text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

// ── Chip multi-select step ────────────────────────────────────────────────────

function ChipStep<T extends string>({
  title,
  subtitle,
  chips,
  selected,
  labels,
  onToggle,
}: {
  title: string;
  subtitle: string;
  chips: T[];
  selected: T[];
  labels: Record<T, string>;
  onToggle: (value: T) => void;
}) {
  return (
    <div className="space-y-lg">
      <header>
        <h1 className="text-h2 text-foreground">{title}</h1>
        <p className="mt-xs text-body text-muted-foreground">{subtitle}</p>
      </header>

      <div className="flex flex-wrap gap-sm" role="group" aria-label={title}>
        {chips.map((chip) => {
          const isSelected = selected.includes(chip);
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(chip)}
              className={cn(
                "min-h-[44px] rounded-full border px-md py-xs text-body transition-colors duration-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
              )}
            >
              {labels[chip]}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-caption text-muted-foreground">
          {selected.length} selected
        </p>
      )}
    </div>
  );
}
