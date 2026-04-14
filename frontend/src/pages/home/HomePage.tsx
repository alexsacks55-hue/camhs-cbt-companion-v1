import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/layouts/AppLayout";
import { UserRole } from "shared/types/enums";
import { YoungPersonDashboard } from "./YoungPersonDashboard";
import { ParentCarerDashboard } from "./ParentCarerDashboard";
import { PractitionerDashboard } from "./PractitionerDashboard";
import { TraineePractitionerDashboard } from "./TraineePractitionerDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { LoadingState } from "@/components/ui/loading-state";

/**
 * Home / Dashboard — root page after sign-in.
 * Renders the correct dashboard for the authenticated user's role.
 * Per app-flow-pages-and-roles.md: each role sees a tailored home.
 */
export default function HomePage() {
  const { user, status } = useAuth();

  if (status === "loading" || !user) {
    return (
      <AppLayout>
        <LoadingState label="Loading your dashboard…" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {user.role === UserRole.YoungPerson && <YoungPersonDashboard user={user} />}
      {user.role === UserRole.ParentCarer && <ParentCarerDashboard user={user} />}
      {user.role === UserRole.Practitioner && <PractitionerDashboard user={user} />}
      {user.role === UserRole.TraineePractitioner && (
        <TraineePractitionerDashboard user={user} />
      )}
      {user.role === UserRole.Admin && <AdminDashboard user={user} />}
    </AppLayout>
  );
}
