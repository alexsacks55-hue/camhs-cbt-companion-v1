import { z } from "zod";
import { prisma } from "../config/database";

// ── Fixed-choice value lists (must match shared/types/enums.ts) ───────────────

const EMOTION_VALUES = [
  "calm", "worried", "sad", "angry", "overwhelmed",
  "hopeful", "tired", "frustrated", "okay", "very_worried", "hopeless",
] as const;

const CONTEXT_VALUES = [
  "school", "friends", "family", "sleep",
  "health", "activities", "home", "not_sure",
] as const;

const COPING_VALUES = [
  "breathing", "going_outside", "talking_to_someone", "grounding",
  "listening_to_music", "taking_a_break", "movement", "routine",
] as const;

// ── Validation schema ─────────────────────────────────────────────────────────

export const CreateCheckinSchema = z.object({
  mood_rating:       z.number().int().min(0).max(10),
  anxiety_rating:    z.number().int().min(0).max(10),
  emotions:          z.array(z.enum(EMOTION_VALUES)).default([]),
  contexts:          z.array(z.enum(CONTEXT_VALUES)).default([]),
  coping_strategies: z.array(z.enum(COPING_VALUES)).default([]),
});

export type CreateCheckinInput = z.infer<typeof CreateCheckinSchema>;

// ── Service functions ─────────────────────────────────────────────────────────

export async function createCheckin(userId: string, data: CreateCheckinInput) {
  return prisma.moodCheckin.create({
    data: {
      user_id:           userId,
      mood_rating:       data.mood_rating,
      anxiety_rating:    data.anxiety_rating,
      emotions:          data.emotions,
      contexts:          data.contexts,
      coping_strategies: data.coping_strategies,
    },
  });
}

/** Most recent N check-ins for a user, newest first. */
export async function listCheckins(userId: string, limit = 7) {
  return prisma.moodCheckin.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    take: limit,
  });
}

/**
 * Return the user's most recent check-in for today (UTC calendar day),
 * or null if they haven't checked in yet.
 */
export async function todayCheckin(userId: string) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);

  return prisma.moodCheckin.findFirst({
    where: {
      user_id:    userId,
      created_at: { gte: start, lte: end },
    },
    orderBy: { created_at: "desc" },
  });
}
