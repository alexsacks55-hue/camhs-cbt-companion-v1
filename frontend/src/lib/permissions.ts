/**
 * Role-based permission definitions.
 * Matches the Role Access Matrix in app-flow-pages-and-roles.md exactly.
 *
 * Usage: canAccess("mood_checkin", user.role)
 * Navigation: visibleNavItems(user.role)
 */

import { UserRole } from "shared/types/enums";

// ── Permission map ────────────────────────────────────────────────────────────

type Feature =
  | "mood_checkin"
  | "review"
  | "patterns"
  | "resources"
  | "session_companion_join"
  | "session_companion_manage"
  | "service_insights"
  | "training"
  | "admin"
  | "diary";

const PERMISSIONS: Record<Feature, UserRole[]> = {
  mood_checkin: [UserRole.YoungPerson, UserRole.ParentCarer],
  review: [UserRole.YoungPerson, UserRole.ParentCarer],
  patterns: [UserRole.YoungPerson, UserRole.ParentCarer],
  diary: [UserRole.YoungPerson],
  resources: [
    UserRole.YoungPerson,
    UserRole.ParentCarer,
    UserRole.Practitioner,
    UserRole.TraineePractitioner,
    UserRole.Admin,
  ],
  session_companion_join: [UserRole.YoungPerson],
  session_companion_manage: [
    UserRole.Practitioner,
    UserRole.TraineePractitioner,
    UserRole.Admin,
  ],
  service_insights: [
    UserRole.Practitioner,
    UserRole.TraineePractitioner,
    UserRole.Admin,
  ],
  training: [UserRole.TraineePractitioner],
  admin: [UserRole.Admin],
};

export function canAccess(feature: Feature, role: UserRole | null | undefined): boolean {
  if (!role) return false;
  return PERMISSIONS[feature].includes(role);
}

// ── Nav items ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  path: string;
}

/** Returns the navigation items visible to a given role (and optionally manual). */
export function visibleNavItems(
  role: UserRole | null | undefined,
  manual?: string | null,
): NavItem[] {
  if (!role) return [];

  const all: Array<NavItem & { roles: UserRole[]; manualRequired?: string }> = [
    {
      label: "Home",
      path: "/home",
      roles: [
        UserRole.YoungPerson,
        UserRole.ParentCarer,
        UserRole.Practitioner,
        UserRole.TraineePractitioner,
        UserRole.Admin,
      ],
    },
    {
      label: "Check-In",
      path: "/check-in",
      roles: [UserRole.YoungPerson, UserRole.ParentCarer],
    },
    {
      label: "Diary",
      path: "/diary",
      roles: [UserRole.YoungPerson],
      manualRequired: "low_mood",
    },
    {
      label: "Review",
      path: "/review",
      roles: [UserRole.YoungPerson, UserRole.ParentCarer],
    },
    {
      label: "Resources",
      path: "/resources",
      roles: [
        UserRole.YoungPerson,
        UserRole.ParentCarer,
        UserRole.Practitioner,
        UserRole.TraineePractitioner,
        UserRole.Admin,
      ],
    },
    {
      label: "Session",
      path: "/session-companion",
      roles: [
        UserRole.YoungPerson,
        UserRole.Practitioner,
        UserRole.TraineePractitioner,
        UserRole.Admin,
      ],
    },
    {
      label: "Insights",
      path: "/service-insights",
      roles: [
        UserRole.Practitioner,
        UserRole.TraineePractitioner,
        UserRole.Admin,
      ],
    },
    {
      label: "Training",
      path: "/training",
      roles: [UserRole.TraineePractitioner],
    },
    {
      label: "Admin",
      path: "/admin",
      roles: [UserRole.Admin],
    },
    {
      label: "Support",
      path: "/support",
      roles: [
        UserRole.YoungPerson,
        UserRole.ParentCarer,
        UserRole.Practitioner,
        UserRole.TraineePractitioner,
        UserRole.Admin,
      ],
    },
  ];

  return all.filter(
    (item) =>
      item.roles.includes(role) &&
      (!item.manualRequired || item.manualRequired === manual),
  );
}

/** Returns the dashboard path for a given role after sign-in or onboarding. */
export function dashboardPathForRole(_role: UserRole): string {
  return "/home";
}
