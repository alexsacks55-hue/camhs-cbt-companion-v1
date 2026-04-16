/**
 * TypeScript types mirroring every database entity.
 * These are plain types — no Prisma dependency, safe to import on the frontend.
 *
 * Naming convention:
 *   DB{Entity}    — the raw row shape (matches column names exactly)
 *   Create{Entity} — the insert payload (omits generated fields)
 *   Update{Entity} — the partial update payload
 */

import type {
  UserRole,
  AgeBand,
  ResourceCategory,
  ResourceSection,
  ResourceStatus,
  ExportType,
  JourneyStep,
  ContentType,
  SummaryType,
  PromptType,
  EmotionChoice,
  ContextChoice,
  CopingChoice,
  AnalyticsEventType,
} from "./enums";

// ─── Users ────────────────────────────────────────────────────────────────────

export interface DBUser {
  id: string;
  username: string;
  password_hash: string;
  role: UserRole;
  age_band: AgeBand | null;
  consent_given: boolean;
  parental_aware: boolean;
  /** CBT programme: "anxiety" | "low_mood" | "behavioural_challenges" | "sleep" | null */
  manual_type: string | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateUser = Pick<DBUser, "username" | "password_hash" | "role"> &
  Partial<Pick<DBUser, "age_band" | "consent_given" | "parental_aware" | "manual_type">>;

export type UpdateUser = Partial<
  Pick<DBUser, "username" | "password_hash" | "age_band" | "consent_given" | "parental_aware" | "manual_type">
>;

/** Safe user shape for API responses — never includes password_hash. */
export type PublicUser = Omit<DBUser, "password_hash">;

// ─── Resources ────────────────────────────────────────────────────────────────

export interface DBResource {
  id: string;
  title: string;
  description: string;
  /** Full body text for Learn resources — paragraphs separated by double newlines. */
  body_text: string | null;
  /** Linked external resources — array of {label: string, url: string}. */
  external_links: Array<{ label: string; url: string }> | null;
  category: ResourceCategory;
  section: ResourceSection;
  status: ResourceStatus;
  export_type: ExportType;
  journey_step: JourneyStep | null;
  content_type: ContentType;
  file_url: string | null;
  typical_session: number | null;
  sort_order: number;
  /** YouTube privacy-enhanced embed URL. Null = no video for this session. */
  video_url: string | null;
  /** Helper text shown above the video embed. */
  video_label: string | null;
  /** "top" = before body text, "below" = after body text. */
  video_placement: string | null;
  /** In-app route to an interactive tool, e.g. "/sleep/diary". */
  app_link: string | null;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateResource = Omit<DBResource, "id" | "created_at" | "updated_at">;
export type UpdateResource = Partial<CreateResource>;

export interface DBResourceVisibility {
  id: string;
  resource_id: string;
  role: UserRole;
}

/** Resource with its visibility join rows — as returned by the API. */
export interface ResourceWithVisibility extends DBResource {
  visibility: Array<{ id: string; resource_id: string; role: UserRole }>;
}

// ─── Mood Check-Ins ───────────────────────────────────────────────────────────

export interface DBMoodCheckin {
  id: string;
  user_id: string;
  mood_rating: number;    // 0–10
  anxiety_rating: number; // 0–10
  emotions: EmotionChoice[];
  contexts: ContextChoice[];
  coping_strategies: CopingChoice[];
  created_at: Date;
}

export type CreateMoodCheckin = Omit<DBMoodCheckin, "id" | "created_at">;

// ─── Activity Completions ─────────────────────────────────────────────────────

export interface DBActivityCompletion {
  id: string;
  user_id: string;
  resource_id: string;
  before_rating: number | null; // 0–10
  after_rating: number | null;  // 0–10
  reflection_choices: string[];
  completed_at: Date;
}

export type CreateActivityCompletion = Omit<DBActivityCompletion, "id" | "completed_at">;

// ─── Structured Summaries ─────────────────────────────────────────────────────

/**
 * The `data` field must only contain safe, structured content.
 * No free text. No names. No identifiable details.
 * Example shape for weekly_review:
 * {
 *   checkins_completed: 4,
 *   activities_completed: 2,
 *   top_emotions: ["worried", "tired"],
 *   top_strategies: ["breathing"],
 *   context_areas: ["school", "sleep"]
 * }
 */
export interface WeeklyReviewData {
  checkins_completed: number;
  activities_completed: number;
  top_emotions: EmotionChoice[];
  top_strategies: CopingChoice[];
  context_areas: ContextChoice[];
}

export interface ActivitySummaryData {
  resource_id: string;
  before_rating: number | null;
  after_rating: number | null;
  reflection_choices: string[];
}

export type StructuredSummaryData = WeeklyReviewData | ActivitySummaryData;

export interface DBStructuredSummary {
  id: string;
  user_id: string;
  summary_type: SummaryType;
  period_start: Date;
  period_end: Date;
  data: StructuredSummaryData;
  generated_at: Date;
}

export type CreateStructuredSummary = Omit<DBStructuredSummary, "id" | "generated_at">;

// ─── Session Companion ────────────────────────────────────────────────────────

export interface DBSessionCompanion {
  id: string;
  session_code: string;
  practitioner_id: string;
  started_at: Date;
  expires_at: Date;
  last_active_at: Date;
  ended_at: Date | null;
  is_active: boolean;
}

export type CreateSessionCompanion = Pick<
  DBSessionCompanion,
  "session_code" | "practitioner_id" | "expires_at"
>;

export interface DBSessionCompanionActivity {
  id: string;
  session_id: string;
  activity_type: string;
  /** Structured choices only — validated before write. Never free text. */
  activity_data: Record<string, unknown>;
  created_at: Date;
}

export type CreateSessionCompanionActivity = Omit<
  DBSessionCompanionActivity,
  "id" | "created_at"
>;

// ─── Safeguarding Prompts ─────────────────────────────────────────────────────

export interface DBSafeguardingPrompt {
  id: string;
  user_id: string;
  prompt_type: PromptType;
  shown_at: Date;
}

export type CreateSafeguardingPrompt = Omit<DBSafeguardingPrompt, "id" | "shown_at">;

// ─── Activity Diary ───────────────────────────────────────────────────────────

export interface DiaryActivityEntry {
  name:   string;
  helped: boolean;
}

export interface DBActivityDiaryEntry {
  id:          string;
  user_id:     string;
  /** Calendar date as "YYYY-MM-DD". */
  entry_date:  string;
  /** 1–10 */
  mood_rating: number;
  activities:  DiaryActivityEntry[];
  created_at:  Date;
  updated_at:  Date;
}

export type CreateActivityDiaryEntry = Omit<DBActivityDiaryEntry, "id" | "created_at" | "updated_at">;

// ─── Sleep Tools ─────────────────────────────────────────────────────────────

export interface DBSleepDiaryEntry {
  id: string;
  user_id: string;
  /** Calendar date as "YYYY-MM-DD". */
  entry_date: string;
  /** Time in "HH:MM" format, e.g. "22:30". */
  bedtime: string;
  /** Time in "HH:MM" format, e.g. "07:15". */
  wake_time: string;
  /** 1–10 sleep quality rating. */
  sleep_quality: number;
  created_at: Date;
  updated_at: Date;
}

export type CreateSleepDiaryEntry = Omit<DBSleepDiaryEntry, "id" | "created_at" | "updated_at">;

export interface DBWindDownRoutine {
  id: string;
  user_id: string;
  /** Target bedtime in "HH:MM" format, e.g. "22:00". Null if not set. */
  target_bedtime: string | null;
  /** Fixed-list activity names selected by the user. */
  activities: string[];
  created_at: Date;
  updated_at: Date;
}

export interface DBWindDownLog {
  id: string;
  user_id: string;
  /** Calendar date as "YYYY-MM-DD". */
  log_date: string;
  /** True if the user confirmed they completed their routine that night. */
  completed: boolean;
  created_at: Date;
}

// ─── Analytics Events (analytics schema) ─────────────────────────────────────

export interface DBAnalyticsEvent {
  id: string;
  event_type: AnalyticsEventType;
  resource_id: string | null;
  category: ResourceCategory | null;
  /** Role group string — not an individual user ID. */
  role_band: UserRole | null;
  occurred_at: Date;
  /** Safe anonymous metadata — no personal details. */
  metadata: Record<string, unknown> | null;
}

export type CreateAnalyticsEvent = Omit<DBAnalyticsEvent, "id" | "occurred_at">;
