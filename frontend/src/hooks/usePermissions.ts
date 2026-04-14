import { useAuth } from "./useAuth";
import { canAccess, visibleNavItems } from "@/lib/permissions";
import { UserRole } from "shared/types/enums";

/**
 * Returns permission helpers based on the currently signed-in user's role.
 *
 * Usage:
 *   const { can, navItems } = usePermissions();
 *   if (can("mood_checkin")) { ... }
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = (user?.role ?? null) as UserRole | null;

  return {
    role,
    can: (feature: Parameters<typeof canAccess>[0]) => canAccess(feature, role),
    navItems: visibleNavItems(role, user?.manual_type ?? null),
  };
}
