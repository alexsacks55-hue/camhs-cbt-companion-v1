/**
 * Centralised route map — matches app-flow-pages-and-roles.md.
 * Use these constants everywhere instead of hardcoded strings.
 */
export const ROUTES = {
  // ── Auth / onboarding ─────────────────────────────────────────────────────
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  changePassword: "/auth/change-password",
  onboardingRole: "/onboarding/role",
  onboardingAge: "/onboarding/age",
  onboardingParentalAwareness: "/onboarding/parental-awareness",

  // ── Core app ──────────────────────────────────────────────────────────────
  home: "/home",
  checkIn: "/check-in",
  review: "/review",
  patterns: "/patterns",
  support: "/support",

  // ── Resources ─────────────────────────────────────────────────────────────
  resources: "/resources",
  resourceCategory: "/resources/:category",
  resourceSection: "/resources/:category/:section",
  resourceDetail: "/resources/view/:resourceId",

  // ── Session Companion ─────────────────────────────────────────────────────
  sessionCompanion: "/session-companion",
  sessionCompanionStart: "/session-companion/start",
  sessionCompanionJoin: "/session-companion/join",
  sessionCompanionActive: "/session-companion/:sessionCode",

  // ── Diary ─────────────────────────────────────────────────────────────────
  diary: "/diary",

  // ── Practitioner / service ────────────────────────────────────────────────
  serviceInsights: "/service-insights",

  // ── Trainee practitioner ──────────────────────────────────────────────────
  training: "/training",

  // ── Admin / content management ────────────────────────────────────────────
  admin: "/admin",
  adminResources: "/admin/resources",
  adminResourceNew: "/admin/resources/new",
  adminResourceEdit: "/admin/resources/:resourceId/edit",
} as const;

/** Helper to build parameterised paths at runtime. */
export const buildRoute = {
  resourceCategory: (category: string) => `/resources/${category}`,
  resourceSection: (category: string, section: string) =>
    `/resources/${category}/${section}`,
  resourceDetail: (resourceId: string) => `/resources/view/${resourceId}`,
  sessionCompanionActive: (sessionCode: string) =>
    `/session-companion/${sessionCode}`,
  adminResourceEdit: (resourceId: string) =>
    `/admin/resources/${resourceId}/edit`,
};
