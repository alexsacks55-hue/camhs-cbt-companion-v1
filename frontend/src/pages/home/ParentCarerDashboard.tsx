import { NHSCard } from "@/components/ui/nhs-dashboard";
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

export function ParentCarerDashboard({ user }: Props) {
  return (
    <div className="space-y-xl">
      <header>
        <h1 className="text-h1 font-bold text-foreground">Hi, {user.username}</h1>
        <p className="mt-xs text-body text-muted-foreground">
          {user.manual_type
            ? `A place to use alongside your young person's ${TREATMENT_LABELS[user.manual_type]} support`
            : "A place to use alongside your young person's CBT support"}
        </p>
      </header>

      <section>
        <SectionDivider label="Your tools" />
        <div className="grid gap-md sm:grid-cols-2">
          <NHSCard
            icon="📚"
            title="Resources"
            description="Access psychoeducation guides, CBT explanations, and printable worksheets relevant to your young person's programme."
            linkTo="/resources"
            linkLabel="Browse resources"
            color="navy"
          />
          <NHSCard
            icon="📋"
            title="Mood Check-In"
            description="Record how you or your young person has been feeling and track patterns over time."
            linkTo="/check-in"
            linkLabel="Start check-in"
            color="blue"
          />
          <NHSCard
            icon="📊"
            title="Weekly Review"
            description="See a summary of recent check-ins and activities to support conversations with your practitioner."
            linkTo="/review"
            linkLabel="View review"
            color="lavender"
          />
          <NHSCard
            icon="💛"
            title="Help and Support"
            description="Guidance on supporting a young person through CBT, plus contacts for urgent help."
            linkTo="/support"
            linkLabel="View support"
            color="teal"
          />
        </div>
      </section>
    </div>
  );
}
