import { Link } from "react-router-dom";
import { NHSCard } from "@/components/ui/nhs-dashboard";
import { useTodayCheckin } from "@/hooks/useCheckins";
import type { AuthUser } from "@/app/AuthContext";

const TREATMENT_LABELS: Record<string, string> = {
  anxiety: "Anxiety",
  low_mood: "Low Mood",
  behavioural_challenges: "Behavioural Challenges",
  sleep: "Sleep",
};

interface Props {
  user: AuthUser;
}

export function YoungPersonDashboard({ user }: Props) {
  const { checkedInToday, data: todayCheckin, status: checkinStatus } = useTodayCheckin();

  return (
    <div className="space-y-xl">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <header>
        <h1 className="text-h1 font-bold text-foreground">Hi, {user.username}</h1>
        <p className="mt-xs text-body text-muted-foreground">
          {user.manual_type
            ? `A place to use alongside your ${TREATMENT_LABELS[user.manual_type]} support`
            : "A place to use alongside your CBT support"}
        </p>

        {/* Check-in nudge — sits inline beneath the title, no card box */}
        {checkinStatus !== "loading" && (
          <div className="mt-md">
            {checkedInToday && todayCheckin
              ? <CheckedInNote />
              : <CheckInNudge />
            }
          </div>
        )}
      </header>

      {/* ── 3. Your tools ──────────────────────────────────────────────── */}
      <section>
        <SectionDivider label="Your tools" />
        <div className="grid gap-md sm:grid-cols-2">
          <NHSCard
            icon="📋"
            title="Mood Check-In"
            description="Record how you're feeling today — mood, anxiety, emotions, and what's been going on."
            linkTo="/check-in"
            linkLabel="Start check-in"
            color="blue"
          />
          <NHSCard
            icon="📊"
            title="Review"
            description="See your recent check-ins, spot any patterns, and track how you've been feeling."
            linkTo="/review"
            linkLabel="View review"
            color="lavender"
          />
          <NHSCard
            icon="📚"
            title="Resources"
            description="Explore CBT guides, psychoeducation, and printable worksheets from your programme."
            linkTo="/resources"
            linkLabel="Browse resources"
            color="navy"
          />
        </div>
      </section>

      {/* ── 3. Support ─────────────────────────────────────────────────── */}
      <section>
        <SectionDivider label="Support" />
        <div className="grid gap-md sm:grid-cols-2">
          <NHSCard
            icon="🤝"
            title="Session Companion"
            description="Join a live session started by your practitioner using the session code they give you."
            linkTo="/session-companion/join"
            linkLabel="Join a session"
            color="sand"
          />
          <NHSCard
            icon="💛"
            title="Help and Support"
            description="Find support contacts and guidance for difficult moments — including urgent help."
            linkTo="/support"
            linkLabel="Get support"
            color="teal"
          />
        </div>
      </section>
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mb-md flex items-center gap-md">
      <p className="whitespace-nowrap text-caption font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="h-px flex-1 rounded-full bg-border" />
    </div>
  );
}


// ── Inline check-in nudge (not yet checked in) ───────────────────────────────

function CheckInNudge() {
  return (
    <Link
      to="/check-in"
      className="inline-flex items-center gap-sm text-body font-medium transition-colors hover:text-primary"
      style={{ color: "#005EB8" }}
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
        style={{ backgroundColor: "#005EB8" }}
        aria-hidden="true"
      >
        +
      </span>
      You haven't checked in today — tap to start
    </Link>
  );
}

// ── Inline confirmed note (already checked in) ────────────────────────────────

function CheckedInNote() {
  return (
    <p className="inline-flex items-center gap-sm text-body text-muted-foreground">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
        style={{ backgroundColor: "#6BAF92" }}
        aria-hidden="true"
      >
        ✓
      </span>
      Today's check-in done — well done.
    </p>
  );
}
