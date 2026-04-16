import { z } from "zod";
import { prisma } from "../config/database";

// ── Validation ─────────────────────────────────────────────────────────────────

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const UpsertSleepDiarySchema = z.object({
  entry_date:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "entry_date must be YYYY-MM-DD"),
  bedtime:       z.string().regex(TIME_REGEX,             "bedtime must be HH:MM"),
  wake_time:     z.string().regex(TIME_REGEX,             "wake_time must be HH:MM"),
  sleep_quality: z.number().int().min(1).max(10),
});

export type UpsertSleepDiaryInput = z.infer<typeof UpsertSleepDiarySchema>;

const WIND_DOWN_ACTIVITIES = [
  "No screens 1 hour before bed",
  "Have a warm bath or shower",
  "Read a book",
  "Listen to calm music",
  "Practice deep breathing",
  "Do some gentle stretching",
  "Dim the lights",
  "Mindfulness or meditation",
  "Make a to-do list for tomorrow",
  "Have a warm drink (e.g. herbal tea)",
  "Tidy your bedroom",
  "Put your phone on charge outside the bedroom",
] as const;

export const UpsertWindDownSchema = z.object({
  target_bedtime: z.string().regex(TIME_REGEX, "target_bedtime must be HH:MM").nullable().optional(),
  activities:     z.array(z.enum(WIND_DOWN_ACTIVITIES)).max(WIND_DOWN_ACTIVITIES.length),
});

export type UpsertWindDownInput = z.infer<typeof UpsertWindDownSchema>;
export { WIND_DOWN_ACTIVITIES };

// ── Sleep diary ────────────────────────────────────────────────────────────────

/** Return diary entries for the past `days` calendar days, newest first. */
export async function listSleepDiary(userId: string, days = 60) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return prisma.sleepDiaryEntry.findMany({
    where: {
      user_id:    userId,
      entry_date: { gte: cutoffStr },
    },
    orderBy: { entry_date: "desc" },
  });
}

/** Create or update the sleep diary entry for a given date. */
export async function upsertSleepDiary(userId: string, input: UpsertSleepDiaryInput) {
  return prisma.sleepDiaryEntry.upsert({
    where: { user_id_entry_date: { user_id: userId, entry_date: input.entry_date } },
    create: {
      user_id:       userId,
      entry_date:    input.entry_date,
      bedtime:       input.bedtime,
      wake_time:     input.wake_time,
      sleep_quality: input.sleep_quality,
    },
    update: {
      bedtime:       input.bedtime,
      wake_time:     input.wake_time,
      sleep_quality: input.sleep_quality,
    },
  });
}

// ── Wind-down routine ──────────────────────────────────────────────────────────

/** Return the user's saved wind-down routine, or null if not yet set. */
export async function getWindDown(userId: string) {
  return prisma.windDownRoutine.findUnique({ where: { user_id: userId } });
}

/** Create or update the user's wind-down routine. */
export async function upsertWindDown(userId: string, input: UpsertWindDownInput) {
  return prisma.windDownRoutine.upsert({
    where:  { user_id: userId },
    create: { user_id: userId, target_bedtime: input.target_bedtime ?? null, activities: input.activities },
    update: { target_bedtime: input.target_bedtime ?? null, activities: input.activities },
  });
}

// ── Wind-down logs ─────────────────────────────────────────────────────────────

export const UpsertWindDownLogSchema = z.object({
  log_date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "log_date must be YYYY-MM-DD"),
  completed: z.boolean(),
});

export type UpsertWindDownLogInput = z.infer<typeof UpsertWindDownLogSchema>;

/** Return daily completion logs for the past `days` calendar days, newest first. */
export async function listWindDownLogs(userId: string, days = 14) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return prisma.windDownLog.findMany({
    where: { user_id: userId, log_date: { gte: cutoffStr } },
    orderBy: { log_date: "desc" },
  });
}

/** Record or update whether the user completed their routine on a given date. */
export async function upsertWindDownLog(userId: string, input: UpsertWindDownLogInput) {
  return prisma.windDownLog.upsert({
    where:  { user_id_log_date: { user_id: userId, log_date: input.log_date } },
    create: { user_id: userId, log_date: input.log_date, completed: input.completed },
    update: { completed: input.completed },
  });
}
