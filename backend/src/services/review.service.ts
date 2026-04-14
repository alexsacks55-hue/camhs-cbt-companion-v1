import { prisma } from "../config/database";

const REVIEW_DAYS = 7;

function countFrequency(items: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const item of items) freq[item] = (freq[item] ?? 0) + 1;
  return freq;
}

function topN(freq: Record<string, number>, n: number): string[] {
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([k]) => k);
}

export async function getWeeklyReview(userId: string) {
  const since = new Date();
  since.setDate(since.getDate() - REVIEW_DAYS);
  since.setUTCHours(0, 0, 0, 0);
  const now = new Date();

  const [checkins, activities] = await Promise.all([
    prisma.moodCheckin.findMany({
      where: { user_id: userId, created_at: { gte: since } },
      orderBy: { created_at: "asc" },
    }),
    prisma.activityCompletion.findMany({
      where: { user_id: userId, completed_at: { gte: since } },
    }),
  ]);

  const allEmotions = checkins.flatMap((c) => c.emotions);
  const allStrategies = checkins.flatMap((c) => c.coping_strategies);
  const allContexts = checkins.flatMap((c) => c.contexts);

  const moodTrend = checkins.map((c) => ({
    date: c.created_at.toISOString(),
    mood: c.mood_rating,
    anxiety: c.anxiety_rating,
  }));

  return {
    period_start: since.toISOString(),
    period_end: now.toISOString(),
    checkins_completed: checkins.length,
    activities_completed: activities.length,
    top_emotions: topN(countFrequency(allEmotions), 3),
    top_strategies: topN(countFrequency(allStrategies), 3),
    context_areas: topN(countFrequency(allContexts), 3),
    mood_trend: moodTrend,
  };
}
