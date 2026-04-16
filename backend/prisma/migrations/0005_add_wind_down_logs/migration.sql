-- Migration: 0005_add_wind_down_logs
-- Adds the wind_down_logs table for daily routine completion tracking.

CREATE TABLE IF NOT EXISTS core.wind_down_logs (
  id          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id     TEXT        NOT NULL,
  log_date    TEXT        NOT NULL,
  completed   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_wind_down_logs_user
    FOREIGN KEY (user_id) REFERENCES core.users(id) ON DELETE CASCADE,
  CONSTRAINT wind_down_logs_user_date_key
    UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS wind_down_logs_user_date_idx
  ON core.wind_down_logs (user_id, log_date);
