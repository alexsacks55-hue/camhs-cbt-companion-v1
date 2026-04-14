/**
 * Application-wide constants.
 * Keep business logic out of here — only stable config values.
 */

export const APP_NAME = "CAMHS CBT Companion";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

// ── Session Companion ─────────────────────────────────────────────────────────

/** Session expires after this many minutes of inactivity — matches the brief. */
export const SESSION_COMPANION_INACTIVITY_MINUTES = 10;

/** Polling interval (ms) to check session expiry on the client. */
export const SESSION_COMPANION_POLL_MS = 30_000;

// ── Mood Check-In ─────────────────────────────────────────────────────────────

export const MOOD_SLIDER_MIN = 0;
export const MOOD_SLIDER_MAX = 10;
export const ANXIETY_SLIDER_MIN = 0;
export const ANXIETY_SLIDER_MAX = 10;

// ── Pattern thresholds (mirrors backend pattern rules) ───────────────────────

/** Mood rating at or below this triggers a low-mood pattern prompt. */
export const PATTERN_LOW_MOOD_THRESHOLD = 3;
/** Anxiety rating at or above this triggers a high-anxiety pattern prompt. */
export const PATTERN_HIGH_ANXIETY_THRESHOLD = 8;
/** Number of days within 7 required to trigger a pattern. */
export const PATTERN_TRIGGER_DAYS = 3;

// ── Fixed choice sets (Phase 6 — Mood Check-In) ───────────────────────────────
// These are defined here as a single source of truth for both UI and validation.

export const EMOTION_CHOICES = [
  "calm",
  "worried",
  "sad",
  "angry",
  "overwhelmed",
  "hopeful",
  "tired",
  "frustrated",
  "okay",
  "very_worried",
  "hopeless",
] as const;

export const CONTEXT_CHOICES = [
  "school",
  "friends",
  "family",
  "sleep",
  "health",
  "activities",
  "home",
  "not_sure",
] as const;

export const COPING_STRATEGY_CHOICES = [
  "breathing",
  "going_outside",
  "talking_to_someone",
  "grounding",
  "listening_to_music",
  "taking_a_break",
  "movement",
  "routine",
] as const;

export type EmotionChoice = (typeof EMOTION_CHOICES)[number];
export type ContextChoice = (typeof CONTEXT_CHOICES)[number];
export type CopingChoice = (typeof COPING_STRATEGY_CHOICES)[number];

/** Emotions that are considered distress-linked for safeguarding pattern rules. */
export const DISTRESS_EMOTIONS: EmotionChoice[] = [
  "hopeless",
  "overwhelmed",
  "very_worried",
];

// ── Analytics event names (shared with backend) ───────────────────────────────

export const ANALYTICS_EVENTS = {
  resourceViewed: "resource_viewed",
  resourceExported: "resource_exported",
  activityStarted: "activity_started",
  activityCompleted: "activity_completed",
  moodCheckinCompleted: "mood_checkin_completed",
  weeklyReviewViewed: "weekly_review_viewed",
  sessionCompanionStarted: "session_companion_started",
  sessionCompanionJoined: "session_companion_joined",
  structuredSummaryGenerated: "structured_summary_generated",
} as const;
