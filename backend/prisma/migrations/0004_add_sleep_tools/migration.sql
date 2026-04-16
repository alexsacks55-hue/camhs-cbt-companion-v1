-- Add app_link to resources (links a resource card to an in-app interactive tool)
ALTER TABLE "core"."resources" ADD COLUMN IF NOT EXISTS "app_link" TEXT;

-- Sleep diary: one entry per user per calendar night
CREATE TABLE IF NOT EXISTS "core"."sleep_diary_entries" (
  "id"            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"       UUID        NOT NULL REFERENCES "core"."users"("id") ON DELETE CASCADE,
  "entry_date"    TEXT        NOT NULL,
  "bedtime"       TEXT        NOT NULL,
  "wake_time"     TEXT        NOT NULL,
  "sleep_quality" SMALLINT    NOT NULL,
  "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("user_id", "entry_date")
);

CREATE INDEX IF NOT EXISTS "sleep_diary_entries_user_date_idx"
  ON "core"."sleep_diary_entries" ("user_id", "entry_date");

-- Wind-down routine: one saved routine per user
CREATE TABLE IF NOT EXISTS "core"."wind_down_routines" (
  "id"             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"        UUID        NOT NULL REFERENCES "core"."users"("id") ON DELETE CASCADE,
  "target_bedtime" TEXT,
  "activities"     JSONB       NOT NULL DEFAULT '[]',
  "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("user_id")
);
