import { NHSCard } from "@/components/ui/nhs-dashboard";
import type { AuthUser } from "@/app/AuthContext";

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

export function PractitionerDashboard({ user }: Props) {
  return (
    <div className="space-y-xl">
      <header>
        <h1 className="text-h1 font-bold text-foreground">Hi, {user.username}</h1>
        <p className="mt-xs text-body text-muted-foreground">
          A place to accompany the important work you are doing with young people, parents and carers
        </p>
      </header>

      <section>
        <SectionDivider label="Clinical tools" />
        <div className="grid gap-md sm:grid-cols-3">
          <NHSCard
            icon="🤝"
            title="Session Companion"
            description="Start a live collaborative session with a young person using a temporary shared session code."
            linkTo="/session-companion/start"
            linkLabel="Start a session"
            color="sand"
          />
          <NHSCard
            icon="📚"
            title="Resources"
            description="Browse CBT manuals, psychoeducation guides, and printable activity worksheets."
            linkTo="/resources"
            linkLabel="Browse resources"
            color="navy"
          />
          <NHSCard
            icon="💛"
            title="Help and Support"
            description="Guidance on using CBT Companion safely and effectively in your clinical practice."
            linkTo="/support"
            linkLabel="Get support"
            color="lavender"
          />
        </div>
      </section>
    </div>
  );
}
