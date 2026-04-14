import { prisma } from "../config/database";

// ── Thresholds (mirrors frontend constants.ts) ────────────────────────────────

const LOW_MOOD_THRESHOLD = 3;
const HIGH_ANXIETY_THRESHOLD = 8;
const TRIGGER_DAYS = 3;
const DISTRESS_EMOTIONS = ["hopeless", "overwhelmed", "very_worried"];
const REVIEW_DAYS = 7;

export type PatternType = "low_mood" | "high_anxiety" | "distress_emotions";

export interface PatternResult {
  type: PatternType;
  triggered: boolean;
  /** How many days/occurrences triggered the rule. */
  count: number;
}

/** Group check-in dates by UTC calendar day. */
function uniqueDaysBelowThreshold(
  checkins: Array<{ created_at: Date; mood_rating: number }>,
  threshold: number
): number {
  const days = new Set<string>();
  for (const c of checkins) {
    if (c.mood_rating <= threshold) {
      days.add(c.created_at.toISOString().slice(0, 10));
    }
  }
  return days.size;
}

function uniqueDaysAboveThreshold(
  checkins: Array<{ created_at: Date; anxiety_rating: number }>,
  threshold: number
): number {
  const days = new Set<string>();
  for (const c of checkins) {
    if (c.anxiety_rating >= threshold) {
      days.add(c.created_at.toISOString().slice(0, 10));
    }
  }
  return days.size;
}

/**
 * Evaluate pattern rules for a user over the past 7 days.
 * Logs newly-triggered patterns to safeguarding_prompts (once per type per day).
 */
export async function evaluatePatterns(userId: string): Promise<PatternResult[]> {
  const since = new Date();
  since.setDate(since.getDate() - REVIEW_DAYS);
  since.setUTCHours(0, 0, 0, 0);

  const checkins = await prisma.moodCheckin.findMany({
    where: { user_id: userId, created_at: { gte: since } },
    orderBy: { created_at: "asc" },
  });

  const lowMoodDays = uniqueDaysBelowThreshold(checkins, LOW_MOOD_THRESHOLD);
  const highAnxietyDays = uniqueDaysAboveThreshold(
    checkins.map((c) => ({ created_at: c.created_at, anxiety_rating: c.anxiety_rating })),
    HIGH_ANXIETY_THRESHOLD
  );
  const distressCount = checkins
    .flatMap((c) => c.emotions)
    .filter((e) => DISTRESS_EMOTIONS.includes(e)).length;

  const results: PatternResult[] = [
    { type: "low_mood",         triggered: lowMoodDays >= TRIGGER_DAYS,    count: lowMoodDays },
    { type: "high_anxiety",     triggered: highAnxietyDays >= TRIGGER_DAYS, count: highAnxietyDays },
    { type: "distress_emotions",triggered: distressCount >= TRIGGER_DAYS,  count: distressCount },
  ];

  // Log triggered patterns (once per type per UTC day)
  const triggeredTypes = results.filter((r) => r.triggered).map((r) => r.type);
  if (triggeredTypes.length > 0) {
    await logNewPrompts(userId, triggeredTypes);
  }

  return results;
}

async function logNewPrompts(userId: string, types: PatternType[]) {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  for (const type of types) {
    const alreadyLogged = await prisma.safeguardingPrompt.findFirst({
      where: {
        user_id: userId,
        prompt_type: type,
        shown_at: { gte: todayStart },
      },
    });
    if (!alreadyLogged) {
      await prisma.safeguardingPrompt.create({
        data: { user_id: userId, prompt_type: type },
      });
    }
  }
}
