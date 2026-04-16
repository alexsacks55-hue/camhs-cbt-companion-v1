import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useWindDown } from "@/hooks/useSleep";
import { cn } from "@/lib/utils";

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
  const { routine, status, save } = useWindDown();

  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [targetBedtime, setTargetBedtime] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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
        </div>
      )}
    </AppLayout>
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
