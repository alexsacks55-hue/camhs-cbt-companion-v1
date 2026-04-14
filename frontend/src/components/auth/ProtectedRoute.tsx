import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { canAccess } from "@/lib/permissions";
import { UserRole } from "shared/types/enums";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, user must have access to this feature to proceed. */
  feature?: Parameters<typeof canAccess>[0];
  /** If provided, user's manual field must match this value. */
  requiredManual?: string;
}

/**
 * Guards a route behind authentication (and optionally a role permission).
 *
 * - If auth is loading: shows nothing (avoids flash of redirect).
 * - If unauthenticated: redirects to sign-in with the intended path saved.
 * - If role check fails: shows a calm access-denied message.
 */
export function ProtectedRoute({ children, feature, requiredManual }: ProtectedRouteProps) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return null; // Silent — prevents flash of unauthenticated content
  }

  if (status === "unauthenticated") {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  const accessDenied = (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg p-md">
      <div className="content-width w-full rounded-lg border border-border bg-card p-xl text-center shadow-sm">
        <p className="text-h3 font-semibold text-foreground">
          This area is not available for your account.
        </p>
        <p className="mt-md text-body text-muted-foreground">
          If you think this is a mistake, please contact your practitioner or support team.
        </p>
      </div>
    </main>
  );

  if (feature && !canAccess(feature, (user?.role ?? null) as UserRole | null)) {
    return accessDenied;
  }

  if (requiredManual && user?.manual_type !== requiredManual) {
    return accessDenied;
  }

  return <>{children}</>;
}
