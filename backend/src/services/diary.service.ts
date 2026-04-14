import { z } from "zod";
import { prisma } from "../config/database";

// ── Validation ─────────────────────────────────────────────────────────────────

const ACTIVITY_NAMES = [
  "Used phone/social media",
  "Watched TV or films",
  "Sport or exercise",
  "Went for a walk",
  "Socialised with friends",
  "Socialised with family",
  "Cooked or baked",
  "Read a book",
  "Listened to music",
  "Spent time outdoors",
  "Gaming",
  "Creative activity",
  "Journalling or writing",
  "Attended school or college",
  "Did homework or studying",
  "Mindfulness or relaxation",
  "Helped someone else",
  "Shopping",
  "Attended an appointment",
  "Rested or slept",
] as const;

export const UpsertDiarySchema = z.object({
  entry_date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "entry_date must be YYYY-MM-DD"),
  mood_rating: z.number().int().min(1).max(10),
  activities:  z.array(
    z.object({
      name:   z.enum(ACTIVITY_NAMES),
      helped: z.boolean(),
    })
  ).max(20),
});

export type UpsertDiaryInput = z.infer<typeof UpsertDiarySchema>;

// ── Service functions ──────────────────────────────────────────────────────────

/** Return diary entries for the past `days` calendar days, newest first. */
export async function list(userId: string, days = 60) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return prisma.activityDiaryEntry.findMany({
    where: {
      user_id:    userId,
      entry_date: { gte: cutoffStr },
    },
    orderBy: { entry_date: "desc" },
  });
}

/** Create or update the diary entry for a given date. */
export async function upsert(userId: string, input: UpsertDiaryInput) {
  return prisma.activityDiaryEntry.upsert({
    where: {
      user_id_entry_date: { user_id: userId, entry_date: input.entry_date },
    },
    create: {
      user_id:     userId,
      entry_date:  input.entry_date,
      mood_rating: input.mood_rating,
      activities:  input.activities,
    },
    update: {
      mood_rating: input.mood_rating,
      activities:  input.activities,
    },
  });
}
