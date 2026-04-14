/**
 * Shared enums — mirror the Prisma schema enums exactly.
 * Used by both frontend (permission checks, labels) and backend (validation).
 */

export enum UserRole {
  YoungPerson = "young_person",
  ParentCarer = "parent_carer",
  Practitioner = "practitioner",
  TraineePractitioner = "trainee_practitioner",
  Admin = "admin",
}

export enum AgeBand {
  Under11 = "under_11",
  ElevenToFifteen = "eleven_to_fifteen",
  SixteenToEighteen = "sixteen_to_eighteen",
  Adult = "adult",
}

export enum ResourceCategory {
  Anxiety = "anxiety",
  LowMood = "low_mood",
  BehaviouralChallenges = "behavioural_challenges",
  Sleep = "sleep",
}

export enum ResourceSection {
  Learn = "learn",
  Activities = "activities",
}

export enum ResourceStatus {
  Draft = "draft",
  Published = "published",
  Hidden = "hidden",
  Archived = "archived",
}

export enum ExportType {
  None = "none",
  BlankTemplate = "blank_template",
  StructuredSummary = "structured_summary",
}

/** "try_it" maps to "try" in UI copy — "try" is a reserved TypeScript keyword. */
export enum JourneyStep {
  Understand = "understand",
  TryIt = "try_it",
  Practise = "practise",
  Review = "review",
}

export enum ContentType {
  Text = "text",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Worksheet = "worksheet",
}

export enum SummaryType {
  WeeklyReview = "weekly_review",
  ActivitySummary = "activity_summary",
}

export enum PromptType {
  LowMood = "low_mood",
  HighAnxiety = "high_anxiety",
  DistressEmotions = "distress_emotions",
  UrgentSupport = "urgent_support",
}

// ── Fixed-choice string union types (match constants.ts in frontend) ──────────

export type EmotionChoice =
  | "calm"
  | "worried"
  | "sad"
  | "angry"
  | "overwhelmed"
  | "hopeful"
  | "tired"
  | "frustrated"
  | "okay"
  | "very_worried"
  | "hopeless";

export type ContextChoice =
  | "school"
  | "friends"
  | "family"
  | "sleep"
  | "health"
  | "activities"
  | "home"
  | "not_sure";

export type CopingChoice =
  | "breathing"
  | "going_outside"
  | "talking_to_someone"
  | "grounding"
  | "listening_to_music"
  | "taking_a_break"
  | "movement"
  | "routine";

/** Analytics event type strings. */
export type AnalyticsEventType =
  | "resource_viewed"
  | "resource_exported"
  | "activity_started"
  | "activity_completed"
  | "mood_checkin_completed"
  | "weekly_review_viewed"
  | "session_companion_started"
  | "session_companion_joined"
  | "structured_summary_generated";
