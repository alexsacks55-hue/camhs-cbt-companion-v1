import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useWindDown, useWindDownLogs } from "@/hooks/useSleep";
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

function formatDayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

const PRESET_ACTIVITIES = [
  "No screens 1 hour before bed",
  "Have a warm bath or shower",
  "Read a book",
  "Listen to calm music",
  "Practice deep breathing",
  "Do some gentle stretching",
  "Dim the lights",
  "Mindfulness or meditation",
  "Make a to-do list for tomorrow",
  "Have a warm drink (e.g. herbal tea)",
  "Tidy your bedroom",
  "Put your phone on charge outside the bedroom",
] as const;

export default function WindDownPage() {
  const navigate = useNavigate();
  const today = todayStr();
  const { routine, status, save } = useWindDown();
  const { logs, status: logsStatus, logCompletion } = useWindDownLogs(14);

  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [targetBedtime, setTargetBedtime] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [logStatus, setLogStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const todayLog = logs.find((l) => l.log_date === today);

  // Populate form when routine loads
  useEffect(() => {
    if (routine) {
      setSelectedActivities(new Set(routine.activities as string[]));
      setTargetBedtime(routine.target_bedtime ?? "");
    }
  }, [routine]);

  function toggleActivity(name: string) {
    setSelectedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
    setSaveStatus("idle");
  }

  async function handleSave() {
    setSaveStatus("saving");
    try {
      await save({
        target_bedtime: targetBedtime || null,
        activities: Array.from(selectedActivities),
      });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  async function handleLog(completed: boolean) {
    setLogStatus("saving");
    try {
      await logCompletion(today, completed);
      setLogStatus("saved");
    } catch {
      setLogStatus("error");
    }
  }

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
        <h1 className="text-h2 text-foreground">Wind-Down Routine Planner</h1>
        <p className="mt-xs text-caption text-muted-foreground">
          Build a calming routine to do before bed. A consistent wind-down helps signal to your body that it's time to sleep.
        </p>
      </header>

      {status === "loading" && <LoadingState label="Loading your routine…" />}
      {status === "error" && (
        <ErrorState
          message="We couldn't load your routine. Please try again."
          onRetry={() => window.location.reload()}
        />
      )}
      {status === "success" && (
        <div className="space-y-xl max-w-content">

          {/* Target bedtime */}
          <section className="space-y-sm">
            <h2 className="text-h3 text-foreground">Target bedtime</h2>
            <p className="text-caption text-muted-foreground">
              What time are you aiming to be in bed by?
            </p>
            <div className="flex items-center gap-md">
              <input
                id="target_bedtime"
                type="time"
                value={targetBedtime}
                onChange={(e) => { setTargetBedtime(e.target.value); setSaveStatus("idle"); }}
                className="rounded-lg border border-border bg-card px-md py-sm text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {targetBedtime && (
                <button
                  onClick={() => { setTargetBedtime(""); setSaveStatus("idle"); }}
                  className="text-caption text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </section>

          {/* Activity checklist */}
          <section className="space-y-sm">
            <h2 className="text-h3 text-foreground">Your wind-down activities</h2>
            <p className="text-caption text-muted-foreground">
              Choose the activities that work best for you. Aim for 3–6 activities starting around 30–60 minutes before your target bedtime.
            </p>
            <div className="flex flex-col gap-xs mt-md">
              {PRESET_ACTIVITIES.map((name) => {
                const isSelected = selectedActivities.has(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleActivity(name)}
                    className={cn(
                      "flex items-center gap-md rounded-xl border px-md py-sm text-left text-caption font-medium transition-colors",
                      isSelected
                        ? "border-[#003087] bg-[#003087]/5 text-[#003087]"
                        : "border-border bg-card text-foreground hover:border-[#41B6E6]",
                    )}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-[11px] font-bold transition-colors",
                        isSelected
                          ? "border-[#003087] bg-[#003087] text-white"
                          : "border-border bg-card",
                      )}
                      aria-hidden="true"
                    >
                      {isSelected ? "✓" : ""}
                    </span>
                    {name}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Your routine preview */}
          {selectedActivities.size > 0 && (
            <section className="rounded-xl border border-border bg-muted/40 p-lg space-y-sm">
              <h2 className="text-h3 text-foreground">
                Your routine
                {targetBedtime && (
                  <span className="ml-sm text-caption font-normal text-muted-foreground">
                    — aim to start by {formatBedtimeOffset(targetBedtime, selectedActivities.size)}
                  </span>
                )}
              </h2>
              <ol className="space-y-xs list-none">
                {Array.from(selectedActivities).map((name, i) => (
                  <li key={name} className="flex items-start gap-sm text-caption text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#003087] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    {name}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Save */}
          <div className="flex items-center gap-md">
            <Button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              style={{ backgroundColor: "#003087" }}
              className="text-white font-semibold"
            >
              {saveStatus === "saving" ? "Saving…" : "Save routine"}
            </Button>
            {saveStatus === "saved" && (
              <span className="text-caption text-green-700 font-medium">Saved ✓</span>
            )}
            {saveStatus === "error" && (
              <span className="text-caption text-destructive font-medium">Couldn't save — please try again.</span>
            )}
          </div>

          {/* Tonight's check-in */}
          {selectedActivities.size > 0 && (
            <section className="rounded-xl border border-border bg-card p-lg space-y-md">
              <h2 className="text-h3 text-foreground">Did you follow your routine tonight?</h2>
              <p className="text-caption text-muted-foreground">
                Log whether you completed your wind-down routine to track your progress.
              </p>
              <div className="flex gap-md">
                <button
                  onClick={() => handleLog(true)}
                  disabled={logStatus === "saving"}
                  className={cn(
                    "flex-1 rounded-xl border-2 py-sm text-caption font-semibold transition-colors",
                    todayLog?.completed === true
                      ? "border-[#003087] bg-[#003087] text-white"
                      : "border-border bg-background text-foreground hover:border-[#003087] hover:text-[#003087]",
                  )}
                >
                  Yes ✓
                </button>
                <button
                  onClick={() => handleLog(false)}
                  disabled={logStatus === "saving"}
                  className={cn(
                    "flex-1 rounded-xl border-2 py-sm text-caption font-semibold transition-colors",
                    todayLog?.completed === false
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-background text-foreground hover:border-muted-foreground",
                  )}
                >
                  Not tonight
                </button>
              </div>
              {logStatus === "error" && (
                <p className="text-caption text-destructive">Couldn't save — please try again.</p>
              )}
            </section>
          )}

          {/* 7-day history */}
          {logsStatus === "success" && <WindDownHistory logs={logs} />}
        </div>
      )}
    </AppLayout>
  );
}

// ── 7-day history chart ───────────────────────────────────────────────────────

function WindDownHistory({ logs }: { logs: { log_date: string; completed: boolean }[] }) {
  const today = todayStr();
  const window: Array<{ date: string; completed: boolean | null }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const log = logs.find((l) => l.log_date === d);
    window.push({ date: d, completed: log ? log.completed : null });
  }

  const hasAny = window.some((d) => d.completed !== null);
  if (!hasAny) return null;

  return (
    <section aria-label="Wind-down routine history">
      <h2 className="text-h3 text-foreground mb-md">Last 7 days</h2>
      <div className="rounded-xl border border-border bg-card p-lg">
        <div className="flex gap-xs">
          {window.map(({ date, completed }) => (
            <div key={date} className="flex flex-1 flex-col items-center gap-xs">
              <div
                className={cn(
                  "w-full rounded-lg flex items-center justify-center text-sm font-bold",
                  completed === true  && "bg-[#003087] text-white",
                  completed === false && "bg-muted text-muted-foreground",
                  completed === null  && "bg-muted/40 text-muted-foreground/40",
                )}
                style={{ height: "40px" }}
                aria-label={
                  completed === true  ? `Completed on ${formatDayLabel(date)}` :
                  completed === false ? `Not completed on ${formatDayLabel(date)}` :
                  `No entry for ${formatDayLabel(date)}`
                }
              >
                {completed === true && "✓"}
                {completed === false && "–"}
              </div>
              <span className="text-[9px] text-muted-foreground text-center leading-tight">
                {formatDayLabel(date)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-md mt-md">
          <span className="flex items-center gap-xs text-[10px] text-muted-foreground">
            <span className="inline-block h-3 w-3 rounded bg-[#003087]" /> Completed
          </span>
          <span className="flex items-center gap-xs text-[10px] text-muted-foreground">
            <span className="inline-block h-3 w-3 rounded bg-muted" /> Not completed
          </span>
        </div>
      </div>
    </section>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

/** Suggest a start time ~5 min per activity before the target bedtime. */
function formatBedtimeOffset(bedtime: string, activityCount: number): string {
  const [h, m] = bedtime.split(":").map(Number);
  const totalMins = h * 60 + m - Math.min(activityCount * 5 + 20, 60);
  const adjusted = ((totalMins % (24 * 60)) + 24 * 60) % (24 * 60);
  const ah = Math.floor(adjusted / 60);
  const am = adjusted % 60;
  return `${String(ah).padStart(2, "0")}:${String(am).padStart(2, "0")}`;
}
