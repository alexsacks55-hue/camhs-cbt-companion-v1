import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useSleepDiary } from "@/hooks/useSleep";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(dateStr: string): string {
  const today = todayStr();
  const yesterday = addDays(today, -1);
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/** Calculate hours between a bedtime and wake time, handling overnight. */
function calcHours(bedtime: string, wakeTime: string): string {
  if (!bedtime || !wakeTime) return "";
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60; // overnight
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SleepDiaryPage() {
  const navigate = useNavigate();
  const { entries, status, save } = useSleepDiary(60);

  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [quality, setQuality] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Populate form when date or entries change
  useEffect(() => {
    const entry = entries.find((e) => e.entry_date === selectedDate);
    if (entry) {
      setBedtime(entry.bedtime);
      setWakeTime(entry.wake_time);
      setQuality(entry.sleep_quality);
    } else {
      setBedtime("");
      setWakeTime("");
      setQuality(null);
    }
    setSaveStatus("idle");
  }, [selectedDate, entries]);

  async function handleSave() {
    if (!bedtime || !wakeTime || quality === null) return;
    setSaveStatus("saving");
    try {
      await save({ entry_date: selectedDate, bedtime, wake_time: wakeTime, sleep_quality: quality });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  const canGoForward = selectedDate < todayStr();
  const hoursSlept = calcHours(bedtime, wakeTime);
  const canSave = !!bedtime && !!wakeTime && quality !== null;

  return (
    <AppLayout>
      <nav className="mb-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/resources/sleep")}
          className="text-muted-foreground -ml-sm"
        >
          ← Sleep resources
        </Button>
      </nav>

      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">Sleep Diary</h1>
        <p className="mt-xs text-caption text-muted-foreground">
          Log your sleep each night to track patterns and spot what helps.
        </p>
      </header>

      {status === "loading" && <LoadingState label="Loading diary…" />}
      {status === "error" && (
        <ErrorState
          message="We couldn't load your sleep diary. Please try again."
          onRetry={() => window.location.reload()}
        />
      )}
      {status === "success" && (
        <div className="space-y-xl max-w-content">

          {/* Date navigation */}
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

          {/* Bedtime + Wake time */}
          <section className="space-y-md">
            <h2 className="text-h3 text-foreground">When did you sleep?</h2>
            <div className="grid grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label htmlFor="bedtime" className="text-caption font-medium text-foreground">
                  Bedtime
                </label>
                <input
                  id="bedtime"
                  type="time"
                  value={bedtime}
                  onChange={(e) => { setBedtime(e.target.value); setSaveStatus("idle"); }}
                  className="w-full rounded-lg border border-border bg-card px-md py-sm text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-xs">
                <label htmlFor="wake_time" className="text-caption font-medium text-foreground">
                  Wake time
                </label>
                <input
                  id="wake_time"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => { setWakeTime(e.target.value); setSaveStatus("idle"); }}
                  className="w-full rounded-lg border border-border bg-card px-md py-sm text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
            {hoursSlept && (
              <p className="text-caption text-muted-foreground">
                Calculated: <span className="font-semibold text-foreground">{hoursSlept}</span> of sleep
              </p>
            )}
          </section>

          {/* Sleep quality */}
          <section aria-label="Sleep quality">
            <h2 className="text-h3 text-foreground mb-sm">How was your sleep quality?</h2>
            <p className="text-caption text-muted-foreground mb-md">1 = very poor, 10 = excellent</p>
            <div className="flex gap-xs flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => { setQuality(n); setSaveStatus("idle"); }}
                  className={cn(
                    "h-10 w-10 rounded-lg border text-caption font-semibold transition-colors",
                    quality === n
                      ? "border-[#003087] bg-[#003087] text-white"
                      : "border-border bg-card text-foreground hover:border-[#003087] hover:text-[#003087]",
                  )}
                  aria-label={`Sleep quality ${n}`}
                  aria-pressed={quality === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>

          {/* Save */}
          <div className="flex items-center gap-md">
            <Button
              onClick={handleSave}
              disabled={!canSave || saveStatus === "saving"}
              style={{ backgroundColor: "#003087" }}
              className="text-white font-semibold"
            >
              {saveStatus === "saving" ? "Saving…" : "Save entry"}
            </Button>
            {saveStatus === "saved" && (
              <span className="text-caption text-green-700 font-medium">Saved ✓</span>
            )}
            {saveStatus === "error" && (
              <span className="text-caption text-destructive font-medium">Couldn't save — please try again.</span>
            )}
            {!canSave && saveStatus === "idle" && (
              <span className="text-caption text-muted-foreground">
                Fill in all fields to save
              </span>
            )}
          </div>

          {/* Chart */}
          <SleepChart entries={entries} />
        </div>
      )}
    </AppLayout>
  );
}

// ── Sleep quality chart ───────────────────────────────────────────────────────

function SleepChart({ entries }: { entries: { entry_date: string; sleep_quality: number }[] }) {
  const days = 14;
  const today = todayStr();
  const window: Array<{ date: string; quality: number | null }> = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    const entry = entries.find((e) => e.entry_date === d);
    window.push({ date: d, quality: entry?.sleep_quality ?? null });
  }

  const hasAny = window.some((d) => d.quality !== null);
  if (!hasAny) return null;

  const chartHeight = 80;

  return (
    <section aria-label="Sleep quality over time">
      <h2 className="text-h3 text-foreground mb-md">Your sleep quality over time</h2>
      <div className="rounded-xl border border-border bg-card p-lg">
        <div className="flex items-end gap-xs" style={{ height: `${chartHeight}px` }}>
          {window.map(({ date, quality }) => (
            <div
              key={date}
              className="flex flex-1 flex-col items-center justify-end"
              style={{ height: `${chartHeight}px` }}
            >
              {quality !== null ? (
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${(quality / 10) * chartHeight}px`,
                    backgroundColor: "#41B6E6",
                    opacity: 0.8,
                    minHeight: "4px",
                  }}
                  title={`${formatDateLabel(date)}: ${quality}/10`}
                  aria-label={`Quality ${quality} on ${formatDateLabel(date)}`}
                />
              ) : (
                <div className="w-full rounded-t bg-muted" style={{ height: "4px" }} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-sm">
          <span className="text-[10px] text-muted-foreground">
            {new Date(`${window[0].date}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
          <span className="text-[10px] text-muted-foreground text-right">Today</span>
        </div>
      </div>
    </section>
  );
}
