-- Migration: 0005_add_wind_down_logs
-- Adds the wind_down_logs table for daily routine completion tracking.

CREATE TABLE IF NOT EXISTS "core"."wind_down_logs" (
  "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"    UUID        NOT NULL REFERENCES "core"."users"("id") ON DELETE CASCADE,
  "log_date"   TEXT        NOT NULL,
  "completed"  BOOLEAN     NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("user_id", "log_date")
);

CREATE INDEX IF NOT EXISTS "wind_down_logs_user_date_idx"
  ON "core"."wind_down_logs" ("user_id", "log_date");
