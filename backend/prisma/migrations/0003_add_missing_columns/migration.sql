-- Add missing columns to resources table
ALTER TABLE "core"."resources" ADD COLUMN IF NOT EXISTS "body_text" TEXT;
ALTER TABLE "core"."resources" ADD COLUMN IF NOT EXISTS "external_links" JSONB;
ALTER TABLE "core"."resources" ADD COLUMN IF NOT EXISTS "video_url" TEXT;
ALTER TABLE "core"."resources" ADD COLUMN IF NOT EXISTS "video_label" TEXT;
ALTER TABLE "core"."resources" ADD COLUMN IF NOT EXISTS "video_placement" TEXT;

-- Add missing activity_diary_entries table
CREATE TABLE IF NOT EXISTS "core"."activity_diary_entries" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"     UUID NOT NULL REFERENCES "core"."users"("id") ON DELETE CASCADE,
  "entry_date"  TEXT NOT NULL,
  "mood_rating" SMALLINT NOT NULL,
  "activities"  JSONB NOT NULL DEFAULT '[]',
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("user_id", "entry_date")
);

CREATE INDEX IF NOT EXISTS "activity_diary_entries_user_date_idx"
  ON "core"."activity_diary_entries" ("user_id", "entry_date");
