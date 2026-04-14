import { useEffect, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useDiary } from "@/hooks/useDiary";
import { cn } from "@/lib/utils";
import type { DiaryActivity } from "@/services/diary.service";

// ── Constants ──────────────────────────────────────────────────────────────────

const ACTIVITY_OPTIONS = [
  "Used phone/social media",
  "Watched TV or films",
  "Sport or exercise",
  "Went for a walk",
  "Socialised with friends",
  "Socialised with family",
  "Cooked or baked",
  "Read a book",
  "Listened to music",
  "Spent time outdoors",
  "Gaming",
  "Creative activity",
  "Journalling or writing",
  "Attended school or college",
  "Did homework or studying",
  "Mindfulness or relaxation",
  "Helped someone else",
  "Shopping",
  "Attended an appointment",
  "Rested or slept",
] as const;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = todayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (dateStr === today) return "Today";
  if (dateStr === yesterdayStr) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ActivityDiaryPage() {
  const { entries, status, save } = useDiary();

  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [helpedMap, setHelpedMap] = useState<Record<string, boolean | null>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Populate form when date or entries change
  useEffect(() => {
    const entry = entries.find((e) => e.entry_date === selectedDate);
    if (entry) {
      setMoodRating(entry.mood_rating);
      const sel = new Set(entry.activities.map((a) => a.name));
      setSelectedActivities(sel);
      const helped: Record<string, boolean | null> = {};
      entry.activities.forEach((a) => { helped[a.name] = a.helped; });
      setHelpedMap(helped);
    } else {
      setMoodRating(null);
      setSelectedActivities(new Set());
      setHelpedMap({});
    }
    setSaveStatus("idle");
  }, [selectedDate, entries]);

  function toggleActivity(name: string) {
    setSelectedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        setHelpedMap((h) => { const n = { ...h }; delete n[name]; return n; });
      } else {
        next.add(name);
        setHelpedMap((h) => ({ ...h, [name]: null }));
      }
      return next;
    });
    setSaveStatus("idle");
  }

  function setHelped(name: string, value: boolean) {
    setHelpedMap((prev) => ({ ...prev, [name]: value }));
    setSaveStatus("idle");
  }

  async function handleSave() {
    if (moodRating === null) return;
    const activities: DiaryActivity[] = Array.from(selectedActivities).map((name) => ({
      name,
      helped: helpedMap[name] ?? false,
    }));
    setSaveStatus("saving");
    try {
      await save({ entry_date: selectedDate, mood_rating: moodRating, activities });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  const canGoForward = selectedDate < todayStr();

  return (
    <AppLayout>
      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">Behavioural Activation Diary</h1>
        <p className="mt-xs text-caption text-muted-foreground">
          Log your mood and activities each day to spot what helps you feel better.
        </p>
      </header>

      {status === "loading" && <LoadingState label="Loading diary…" />}
      {status === "error" && (
        <ErrorState
          message="We couldn't load your diary. Please try again."
          onRetry={() => window.location.reload()}
        />
      )}
      {status === "success" && (
        <div className="space-y-xl max-w-content">
          {/* ── Date navigation ── */}
          <div className="flex items-center gap-md">
            <button
              onClick={() => setSelectedDate((d) => addDays(d, -1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Previous day"
            >
              ‹
            </button>
            <span className="flex-1 text-center text-body font-semibold text-foreground">
              {formatDateLabel(selectedDate)}
            </span>
            <button
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
              disabled={!canGoForward}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors",
                canGoForward ? "hover:bg-muted" : "opacity-30 cursor-not-allowed",
              )}
              aria-label="Next day"
            >
              ›
            </button>
          </div>

          {/* ── Mood rating ── */}
          <section aria-label="Mood rating">
            <h2 className="text-h3 text-foreground mb-sm">How was your mood?</h2>
            <p className="text-caption text-muted-foreground mb-md">1 = very low, 10 = very good</p>
            <div className="flex gap-xs flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => { setMoodRating(n); setSaveStatus("idle"); }}
                  className={cn(
                    "h-10 w-10 rounded-lg border text-caption font-semibold transition-colors",
                    moodRating === n
                      ? "border-[#003087] bg-[#003087] text-white"
                      : "border-border bg-card text-foreground hover:border-[#003087] hover:text-[#003087]",
                  )}
                  aria-label={`Mood rating ${n}`}
                  aria-pressed={moodRating === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>

          {/* ── Activity chips ── */}
          <section aria-label="Activities">
            <h2 className="text-h3 text-foreground mb-sm">What did you do today?</h2>
            <p className="text-caption text-muted-foreground mb-md">
              Tap to select all activities that apply.
            </p>
            <div className="flex flex-wrap gap-sm">
              {ACTIVITY_OPTIONS.map((name) => {
                const isSelected = selectedActivities.has(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleActivity(name)}
                    className={cn(
                      "rounded-full border px-md py-xs text-caption font-medium transition-colors",
                      isSelected
                        ? "border-[#003087] bg-[#003087] text-white"
                        : "border-border bg-card text-foreground hover:border-[#41B6E6] hover:text-[#003087]",
                    )}
                    aria-pressed={isSelected}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Helped toggles ── */}
          {selectedActivities.size > 0 && (
            <section aria-label="Did each activity help?">
              <h2 className="text-h3 text-foreground mb-sm">Did each activity help?</h2>
              <p className="text-caption text-muted-foreground mb-md">
                Mark whether each activity made you feel better or not.
              </p>
              <ul className="space-y-sm">
                {Array.from(selectedActivities).map((name) => {
                  const helped = helpedMap[name];
                  return (
                    <li
                      key={name}
                      className="flex items-center justify-between gap-md rounded-xl border border-border bg-card px-md py-sm"
                    >
                      <span className="text-caption font-medium text-foreground flex-1 min-w-0">
                        {name}
                      </span>
                      <div className="flex gap-xs shrink-0">
                        <button
                          onClick={() => setHelped(name, true)}
                          className={cn(
                            "rounded-lg border px-sm py-xs text-[11px] font-semibold transition-colors",
                            helped === true
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-border bg-card text-muted-foreground hover:border-green-600 hover:text-green-700",
                          )}
                          aria-pressed={helped === true}
                          aria-label={`${name} helped`}
                        >
                          Helped
                        </button>
                        <button
                          onClick={() => setHelped(name, false)}
                          className={cn(
                            "rounded-lg border px-sm py-xs text-[11px] font-semibold transition-colors",
                            helped === false
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground",
                          )}
                          aria-pressed={helped === false}
                          aria-label={`${name} didn't help`}
                        >
                          Didn't help
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* ── Save button ── */}
          <div className="flex items-center gap-md">
            <Button
              onClick={handleSave}
              disabled={moodRating === null || saveStatus === "saving"}
              style={{ backgroundColor: "#003087" }}
              className="text-white font-semibold"
            >
              {saveStatus === "saving" ? "Saving…" : "Save entry"}
            </Button>
            {saveStatus === "saved" && (
              <span className="text-caption text-green-700 font-medium">Saved</span>
            )}
            {saveStatus === "error" && (
              <span className="text-caption text-destructive font-medium">
                Couldn't save. Please try again.
              </span>
            )}
            {moodRating === null && saveStatus === "idle" && (
              <span className="text-caption text-muted-foreground">
                Select a mood rating to save
              </span>
            )}
          </div>

          {/* ── Mood chart ── */}
          <MoodChart entries={entries} />
        </div>
      )}
    </AppLayout>
  );
}

// ── Mood chart ────────────────────────────────────────────────────────────────

function MoodChart({ entries }: { entries: { entry_date: string; mood_rating: number }[] }) {
  // Build a 14-day window ending today
  const days = 14;
  const today = todayStr();
  const window: Array<{ date: string; mood: number | null }> = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    const entry = entries.find((e) => e.entry_date === d);
    window.push({ date: d, mood: entry?.mood_rating ?? null });
  }

  const chartHeight = 80;
  const maxMood = 10;

  const hasAny = window.some((d) => d.mood !== null);
  if (!hasAny) return null;

  return (
    <section aria-label="Mood over time">
      <h2 className="text-h3 text-foreground mb-md">Your mood over time</h2>
      <div className="rounded-xl border border-border bg-card p-lg">
        {/* Bars */}
        <div className="flex items-end gap-xs" style={{ height: `${chartHeight}px` }}>
          {window.map(({ date, mood }) => (
            <div
              key={date}
              className="flex flex-1 flex-col items-center justify-end"
              style={{ height: `${chartHeight}px` }}
            >
              {mood !== null ? (
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${(mood / maxMood) * chartHeight}px`,
                    backgroundColor: "#003087",
                    opacity: 0.7,
                    minHeight: "4px",
                  }}
                  title={`${formatDateLabel(date)}: ${mood}/10`}
                  aria-label={`Mood ${mood} on ${formatDateLabel(date)}`}
                />
              ) : (
                <div className="w-full rounded-t bg-muted" style={{ height: "4px" }} />
              )}
            </div>
          ))}
        </div>
        {/* X-axis labels — show first and last date */}
        <div className="flex justify-between mt-sm">
          <span className="text-[10px] text-muted-foreground">
            {new Date(`${window[0].date}T00:00:00`).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="text-[10px] text-muted-foreground text-right">
            Today
          </span>
        </div>
      </div>
    </section>
  );
}
