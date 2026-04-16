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
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
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
  const today = todayStr();
  const { entries, status, save } = useSleepDiary(14);

  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [quality, setQuality] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Populate form from today's entry if it exists
  useEffect(() => {
    if (status !== "success") return;
    const entry = entries.find((e) => e.entry_date === today);
    if (entry) {
      setBedtime(entry.bedtime);
      setWakeTime(entry.wake_time);
      setQuality(entry.sleep_quality);
    }
  }, [status]);

  async function handleSave() {
    if (!bedtime || !wakeTime || quality === null) return;
    setSaveStatus("saving");
    try {
      await save({ entry_date: today, bedtime, wake_time: wakeTime, sleep_quality: quality });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

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

          {/* Tonight's entry */}
          <section className="rounded-xl border border-border bg-card p-lg space-y-md">
            <h2 className="text-h3 text-foreground">Tonight's entry</h2>

            {/* Bedtime + Wake time */}
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
                  className="w-full rounded-lg border border-border bg-background px-md py-sm text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="w-full rounded-lg border border-border bg-background px-md py-sm text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
            {hoursSlept && (
              <p className="text-caption text-muted-foreground">
                Calculated: <span className="font-semibold text-foreground">{hoursSlept}</span> of sleep
              </p>
            )}

            {/* Sleep quality */}
            <div>
              <p className="text-caption font-medium text-foreground mb-xs">Sleep quality</p>
              <p className="text-caption text-muted-foreground mb-sm">1 = very poor, 10 = excellent</p>
              <div className="flex gap-xs flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setQuality(n); setSaveStatus("idle"); }}
                    className={cn(
                      "h-10 w-10 rounded-lg border text-caption font-semibold transition-colors",
                      quality === n
                        ? "border-[#003087] bg-[#003087] text-white"
                        : "border-border bg-background text-foreground hover:border-[#003087] hover:text-[#003087]",
                    )}
                    aria-label={`Sleep quality ${n}`}
                    aria-pressed={quality === n}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-md pt-xs">
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
                <span className="text-caption text-muted-foreground">Fill in all fields to save</span>
              )}
            </div>
          </section>

          {/* 7-day history */}
          <SleepChart entries={entries} />
        </div>
      )}
    </AppLayout>
  );
}

// ── Sleep quality chart ───────────────────────────────────────────────────────

function SleepChart({ entries }: { entries: { entry_date: string; sleep_quality: number; bedtime: string; wake_time: string }[] }) {
  const today = todayStr();
  const window: Array<{ date: string; quality: number | null; hours: string | null }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const entry = entries.find((e) => e.entry_date === d);
    window.push({
      date: d,
      quality: entry?.sleep_quality ?? null,
      hours: entry ? calcHours(entry.bedtime, entry.wake_time) : null,
    });
  }

  const hasAny = window.some((d) => d.quality !== null);
  if (!hasAny) return null;

  const chartHeight = 80;

  return (
    <section aria-label="Sleep quality over the past 7 days">
      <h2 className="text-h3 text-foreground mb-md">Last 7 days</h2>
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
                    opacity: 0.85,
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
        {/* Day labels */}
        <div className="flex mt-sm gap-xs">
          {window.map(({ date, quality, hours }) => (
            <div key={date} className="flex flex-1 flex-col items-center gap-xs">
              <span className="text-[9px] text-muted-foreground text-center leading-tight">
                {formatDateLabel(date)}
              </span>
              {quality !== null && (
                <span className="text-[9px] font-semibold text-foreground">{quality}/10</span>
              )}
              {hours && (
                <span className="text-[9px] text-muted-foreground">{hours}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
