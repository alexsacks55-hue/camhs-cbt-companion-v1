import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "@/components/ui/loading-state";
import { sessionApi, type Session } from "@/services/session.service";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "shared/types/enums";
import { cn } from "@/lib/utils";
import { SESSION_COMPANION_POLL_MS } from "@/config/constants";

const EMOTION_LABELS: Record<string, string> = {
  calm: "Calm", worried: "Worried", sad: "Sad", angry: "Angry",
  overwhelmed: "Overwhelmed", hopeful: "Hopeful", tired: "Tired",
  frustrated: "Frustrated", okay: "Okay", very_worried: "Very worried",
  hopeless: "Hopeless",
};

const ALL_EMOTIONS = Object.keys(EMOTION_LABELS);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ActiveSessionPage() {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [loadStatus, setLoadStatus] = useState<"loading" | "active" | "expired" | "ended" | "error">("loading");

  const isPractitioner =
    user?.role === UserRole.Practitioner ||
    user?.role === UserRole.TraineePractitioner ||
    user?.role === UserRole.Admin;

  const fetchSession = useCallback(async () => {
    if (!sessionCode) return;
    try {
      const s = await sessionApi.get(sessionCode);
      setSession(s);
      setLoadStatus("active");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 410) {
        setLoadStatus(session?.ended_at ? "ended" : "expired");
      } else {
        setLoadStatus("error");
      }
    }
  }, [sessionCode]);

  // Initial load + polling
  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, SESSION_COMPANION_POLL_MS);
    return () => clearInterval(interval);
  }, [fetchSession]);

  // Countdown to expiry
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!session?.expires_at) return;
    const tick = () => {
      const ms = new Date(session.expires_at).getTime() - Date.now();
      setSecondsLeft(Math.max(0, Math.floor(ms / 1000)));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [session?.expires_at]);

  async function handleEnd() {
    if (!sessionCode) return;
    if (!confirm("End this session? All session data will be discarded.")) return;
    try {
      await sessionApi.end(sessionCode);
      navigate("/session-companion");
    } catch {
      // If it fails, the session will expire naturally
      navigate("/session-companion");
    }
  }

  if (loadStatus === "loading") return <AppLayout><LoadingState label="Connecting to session…" /></AppLayout>;

  if (loadStatus === "expired" || loadStatus === "ended") {
    return (
      <AppLayout>
        <div className="max-w-content space-y-md">
          <h1 className="text-h2 text-foreground">
            {loadStatus === "expired" ? "Session has expired" : "Session has ended"}
          </h1>
          <p className="text-body text-muted-foreground">
            {loadStatus === "expired"
              ? "This session timed out due to inactivity. Any activities completed during the session were temporary and have not been saved."
              : "This session has been ended. Any activities completed during the session were temporary and have not been saved."}
          </p>
          <Button onClick={() => navigate("/session-companion")}>Back to Session Companion</Button>
        </div>
      </AppLayout>
    );
  }

  if (loadStatus === "error" || !session) {
    return (
      <AppLayout>
        <div className="max-w-content space-y-md">
          <h1 className="text-h2 text-foreground">Session not found</h1>
          <p className="text-body text-muted-foreground">Check the session code and try again.</p>
          <Button onClick={() => navigate("/session-companion/join")}>Try again</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Session header */}
      <div className="mb-lg flex items-center justify-between gap-md flex-wrap">
        <div>
          <p className="text-caption text-muted-foreground">Active session</p>
          <h1 className="text-h2 text-foreground font-mono tracking-wider">{session.session_code}</h1>
        </div>
        <div className="flex items-center gap-md">
          {secondsLeft !== null && secondsLeft < 120 && (
            <span className="text-caption text-status-warning font-medium">
              Expires in {secondsLeft}s
            </span>
          )}
          {isPractitioner && (
            <Button variant="outline" size="sm" onClick={handleEnd}>
              End session
            </Button>
          )}
        </div>
      </div>

      {/* Temporary use reminder */}
      <Alert className="mb-lg">
        <AlertDescription>
          Activities completed in session companion mode are temporary and will not be saved.
          If you wish to keep a copy for discussion, you may take a screenshot.
          Please avoid including names or personal details.
        </AlertDescription>
      </Alert>

      <div className="max-w-content space-y-xl">
        {/* Activity input — for young person */}
        {!isPractitioner && (
          <MoodSnapshotForm sessionCode={session.session_code} onSubmit={fetchSession} />
        )}

        {/* Activity feed — visible to all */}
        {session.activities.length > 0 && (
          <ActivityFeed activities={session.activities} />
        )}

        {session.activities.length === 0 && isPractitioner && (
          <div className="rounded-xl border border-border bg-card p-lg text-center">
            <p className="text-body text-muted-foreground">
              Waiting for the young person to complete an activity…
            </p>
            <p className="text-caption text-muted-foreground mt-xs">
              Share the code <strong className="font-mono">{session.session_code}</strong> with them.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// ── Mood snapshot form (young person) ─────────────────────────────────────────

function MoodSnapshotForm({
  sessionCode,
  onSubmit,
}: {
  sessionCode: string;
  onSubmit: () => void;
}) {
  const [mood, setMood] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleEmotion(e: string) {
    setEmotions((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await sessionApi.addMoodSnapshot(sessionCode, {
        mood_rating: mood,
        anxiety_rating: anxiety,
        emotions,
      });
      setSubmitted(true);
      onSubmit();
    } catch {
      setError("We couldn't save the activity. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-calm-teal/30 bg-calm-teal/10 p-lg">
        <p className="text-body font-medium text-foreground">Activity shared</p>
        <p className="mt-xs text-caption text-muted-foreground">
          Your mood snapshot has been shared with your CAMHS worker for this session.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-lg">
      <h2 className="text-h3 text-foreground">How are you feeling right now?</h2>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Sliders */}
      <div className="space-y-md">
        <SliderField label="Mood" value={mood} onChange={setMood} lowLabel="Very low" highLabel="Really good" />
        <SliderField label="Anxiety" value={anxiety} onChange={setAnxiety} lowLabel="Very calm" highLabel="Very anxious" />
      </div>

      {/* Emotions */}
      <div>
        <p className="text-body font-medium text-foreground mb-sm">
          Select any emotions that apply
        </p>
        <div className="flex flex-wrap gap-sm">
          {ALL_EMOTIONS.map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={emotions.includes(e)}
              onClick={() => toggleEmotion(e)}
              className={cn(
                "min-h-[44px] rounded-full border px-md py-xs text-body transition-colors duration-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                emotions.includes(e)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              )}
            >
              {EMOTION_LABELS[e]}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Sharing…" : "Share with my CAMHS worker"}
      </Button>
    </form>
  );
}

function SliderField({
  label, value, onChange, lowLabel, highLabel,
}: {
  label: string; value: number; onChange: (v: number) => void;
  lowLabel: string; highLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-lg space-y-sm">
      <div className="flex items-center justify-between">
        <span className="text-body font-medium text-foreground">{label}</span>
        <span className="text-h2 font-semibold text-primary" aria-live="polite">{value}</span>
      </div>
      <Slider value={value} min={0} max={10} step={1} onChange={onChange} aria-label={label} />
      <div className="flex justify-between text-caption text-muted-foreground">
        <span>{lowLabel}</span><span>{highLabel}</span>
      </div>
    </div>
  );
}

// ── Activity feed (both roles) ────────────────────────────────────────────────

function ActivityFeed({ activities }: { activities: Session["activities"] }) {
  return (
    <div>
      <h2 className="text-h3 text-foreground mb-md">Session activities</h2>
      <ul className="space-y-md">
        {activities.map((a) => {
          const d = a.activity_data as {
            mood_rating?: number;
            anxiety_rating?: number;
            emotions?: string[];
          };
          return (
            <li key={a.id} className="rounded-xl border border-border bg-card p-lg">
              <p className="text-caption text-muted-foreground mb-sm">
                Mood snapshot · {new Date(a.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <div className="flex gap-lg">
                <div>
                  <p className="text-caption text-muted-foreground">Mood</p>
                  <p className="text-h2 font-semibold text-foreground">{d.mood_rating ?? "—"}<span className="text-caption font-normal text-muted-foreground"> / 10</span></p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Anxiety</p>
                  <p className="text-h2 font-semibold text-foreground">{d.anxiety_rating ?? "—"}<span className="text-caption font-normal text-muted-foreground"> / 10</span></p>
                </div>
              </div>
              {d.emotions && d.emotions.length > 0 && (
                <div className="mt-sm flex flex-wrap gap-xs">
                  {d.emotions.map((e) => (
                    <span key={e} className="rounded-full border border-border bg-muted px-sm py-xs text-caption text-foreground">
                      {EMOTION_LABELS[e] ?? e}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
