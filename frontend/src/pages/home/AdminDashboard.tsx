import { NHSWelcomeBanner, NHSCard } from "@/components/ui/nhs-dashboard";
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

export function AdminDashboard({ user }: Props) {
  return (
    <div className="space-y-xl">
      <NHSWelcomeBanner
        username={user.username}
        roleLabel="Administrator"
        message="Welcome to CBT Companion — your centralised system to manage content, run sessions, and support your service."
      />

      <section>
        <SectionDivider label="Management" />
        <div className="grid gap-md sm:grid-cols-2">
          <NHSCard
            icon="🗂️"
            title="Content Management"
            description="Add, edit, publish, and archive resources and worksheets across all four programme categories."
            linkTo="/admin/resources"
            linkLabel="Manage resources"
            color="navy"
          />
          <NHSCard
            icon="📚"
            title="Resources"
            description="Browse the live resource library as it appears to users."
            linkTo="/resources"
            linkLabel="Browse resources"
            color="blue"
          />
        </div>
      </section>

      <section>
        <SectionDivider label="Clinical tools" />
        <div className="grid gap-md sm:grid-cols-2">
          <NHSCard
            icon="🤝"
            title="Session Companion"
            description="Start a live collaborative session with a young person using a temporary shared session code."
            linkTo="/session-companion/start"
            linkLabel="Start a session"
            color="sand"
          />
          <NHSCard
            icon="💛"
            title="Help and Support"
            description="Support contacts and documentation for using and administering CBT Companion."
            linkTo="/support"
            linkLabel="Get support"
            color="lavender"
          />
        </div>
      </section>
    </div>
  );
}
