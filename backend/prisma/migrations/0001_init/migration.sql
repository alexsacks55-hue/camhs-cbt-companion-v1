-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 0001_init
-- Creates the core and analytics PostgreSQL schemas, all enums, and all tables.
-- Run with: npx prisma migrate deploy (production) or npx prisma migrate dev (local)
-- ─────────────────────────────────────────────────────────────────────────────

-- Create schemas
CREATE SCHEMA IF NOT EXISTS "core";
CREATE SCHEMA IF NOT EXISTS "analytics";

-- ─── Enums (core schema) ──────────────────────────────────────────────────────

CREATE TYPE "core"."UserRole" AS ENUM (
  'young_person',
  'parent_carer',
  'practitioner',
  'trainee_practitioner',
  'admin'
);

CREATE TYPE "core"."AgeBand" AS ENUM (
  'under_11',
  'eleven_to_fifteen',
  'sixteen_to_eighteen',
  'adult'
);

CREATE TYPE "core"."ResourceCategory" AS ENUM (
  'anxiety',
  'low_mood',
  'behavioural_challenges',
  'sleep'
);

CREATE TYPE "core"."ResourceSection" AS ENUM (
  'learn',
  'activities'
);

CREATE TYPE "core"."ResourceStatus" AS ENUM (
  'draft',
  'published',
  'hidden',
  'archived'
);

CREATE TYPE "core"."ExportType" AS ENUM (
  'none',
  'blank_template',
  'structured_summary'
);

-- 'try_it' maps to "try" in UI copy — "try" avoided as a potential reserved word.
CREATE TYPE "core"."JourneyStep" AS ENUM (
  'understand',
  'try_it',
  'practise',
  'review'
);

CREATE TYPE "core"."ContentType" AS ENUM (
  'text',
  'pdf',
  'audio',
  'video',
  'worksheet'
);

CREATE TYPE "core"."SummaryType" AS ENUM (
  'weekly_review',
  'activity_summary'
);

CREATE TYPE "core"."PromptType" AS ENUM (
  'low_mood',
  'high_anxiety',
  'distress_emotions',
  'urgent_support'
);

-- ─── Tables (core schema) ─────────────────────────────────────────────────────

-- Pseudonymous users. No real names, email addresses, or DOBs.
CREATE TABLE "core"."users" (
  "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "username"       VARCHAR(50) UNIQUE NOT NULL,
  "password_hash"  TEXT NOT NULL,
  "role"           "core"."UserRole" NOT NULL,
  "age_band"       "core"."AgeBand",
  "consent_given"       BOOLEAN NOT NULL DEFAULT false,
  "parental_aware"      BOOLEAN NOT NULL DEFAULT false,
  -- Hashed refresh token. One active session per user in V1. NULL = logged out.
  "refresh_token_hash"  TEXT,
  "created_at"          TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CBT resources — never contains user data.
CREATE TABLE "core"."resources" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title"           TEXT NOT NULL,
  "description"     TEXT NOT NULL,
  "category"        "core"."ResourceCategory" NOT NULL,
  "section"         "core"."ResourceSection" NOT NULL,
  "status"          "core"."ResourceStatus" NOT NULL DEFAULT 'draft',
  "export_type"     "core"."ExportType" NOT NULL DEFAULT 'none',
  "journey_step"    "core"."JourneyStep",
  "content_type"    "core"."ContentType" NOT NULL DEFAULT 'text',
  "file_url"        TEXT,
  "typical_session" INTEGER,
  "sort_order"      INTEGER NOT NULL DEFAULT 0,
  "created_by"      UUID,
  "created_at"      TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "resources_category_section_status_idx"
  ON "core"."resources" ("category", "section", "status");
CREATE INDEX "resources_category_sort_idx"
  ON "core"."resources" ("category", "sort_order");

-- Role-based resource visibility.
CREATE TABLE "core"."resource_visibility" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "resource_id" UUID NOT NULL REFERENCES "core"."resources"("id") ON DELETE CASCADE,
  "role"        "core"."UserRole" NOT NULL,
  UNIQUE ("resource_id", "role")
);

-- Structured mood check-ins. Arrays hold fixed-list string values only.
-- CONSTRAINT: mood_rating and anxiety_rating must be 0–10.
CREATE TABLE "core"."mood_checkins" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"           UUID NOT NULL REFERENCES "core"."users"("id") ON DELETE CASCADE,
  "mood_rating"       SMALLINT NOT NULL CHECK ("mood_rating" BETWEEN 0 AND 10),
  "anxiety_rating"    SMALLINT NOT NULL CHECK ("anxiety_rating" BETWEEN 0 AND 10),
  "emotions"          TEXT[] NOT NULL DEFAULT '{}',
  "contexts"          TEXT[] NOT NULL DEFAULT '{}',
  "coping_strategies" TEXT[] NOT NULL DEFAULT '{}',
  "created_at"        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "mood_checkins_user_created_idx"
  ON "core"."mood_checkins" ("user_id", "created_at" DESC);

-- Activity completion records with optional before/after ratings.
CREATE TABLE "core"."activity_completions" (
  "id"                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"            UUID NOT NULL REFERENCES "core"."users"("id") ON DELETE CASCADE,
  "resource_id"        UUID NOT NULL,
  "before_rating"      SMALLINT CHECK ("before_rating" BETWEEN 0 AND 10),
  "after_rating"       SMALLINT CHECK ("after_rating" BETWEEN 0 AND 10),
  "reflection_choices" TEXT[] NOT NULL DEFAULT '{}',
  "completed_at"       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "activity_completions_user_completed_idx"
  ON "core"."activity_completions" ("user_id", "completed_at" DESC);

-- Generated structured summaries. data JSON must never contain free text.
CREATE TABLE "core"."structured_summaries" (
  "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"      UUID NOT NULL REFERENCES "core"."users"("id") ON DELETE CASCADE,
  "summary_type" "core"."SummaryType" NOT NULL,
  "period_start" TIMESTAMPTZ NOT NULL,
  "period_end"   TIMESTAMPTZ NOT NULL,
  "data"         JSONB NOT NULL,
  "generated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "structured_summaries_user_type_generated_idx"
  ON "core"."structured_summaries" ("user_id", "summary_type", "generated_at" DESC);

-- Temporary Session Companion records.
-- The expiry job deletes rows with expires_at < now() AND is_active = false.
CREATE TABLE "core"."session_companions" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_code"    VARCHAR(12) UNIQUE NOT NULL,
  "practitioner_id" UUID NOT NULL,
  "started_at"      TIMESTAMPTZ NOT NULL DEFAULT now(),
  "expires_at"      TIMESTAMPTZ NOT NULL,
  "last_active_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "ended_at"        TIMESTAMPTZ,
  "is_active"       BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX "session_companions_code_active_idx"
  ON "core"."session_companions" ("session_code", "is_active");
CREATE INDEX "session_companions_expires_active_idx"
  ON "core"."session_companions" ("expires_at", "is_active");

-- Temporary activity data. Cascade-deleted with the session.
CREATE TABLE "core"."session_companion_activities" (
  "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id"    UUID NOT NULL REFERENCES "core"."session_companions"("id") ON DELETE CASCADE,
  "activity_type" TEXT NOT NULL,
  "activity_data" JSONB NOT NULL,
  "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safeguarding prompt audit log.
CREATE TABLE "core"."safeguarding_prompts" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"     UUID NOT NULL REFERENCES "core"."users"("id") ON DELETE CASCADE,
  "prompt_type" "core"."PromptType" NOT NULL,
  "shown_at"    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "safeguarding_prompts_user_shown_idx"
  ON "core"."safeguarding_prompts" ("user_id", "shown_at" DESC);

-- ─── Tables (analytics schema) ────────────────────────────────────────────────
-- Fully separated from core. No foreign keys to core tables.

CREATE TABLE "analytics"."analytics_events" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "event_type"  TEXT NOT NULL,
  "resource_id" UUID,
  "category"    TEXT,
  "role_band"   TEXT,
  "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "metadata"    JSONB
);

CREATE INDEX "analytics_events_type_occurred_idx"
  ON "analytics"."analytics_events" ("event_type", "occurred_at" DESC);
CREATE INDEX "analytics_events_occurred_idx"
  ON "analytics"."analytics_events" ("occurred_at" DESC);
