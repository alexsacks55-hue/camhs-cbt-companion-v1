import { prisma } from "../config/database";

const INSIGHTS_DAYS = 30;

function since(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function periodCounts(cutoff: Date) {
  const [app_uses, resource_opens, checkins] = await Promise.all([
    prisma.analyticsEvent.count({ where: { occurred_at: { gte: cutoff } } }),
    prisma.analyticsEvent.count({ where: { event_type: "resource_viewed", occurred_at: { gte: cutoff } } }),
    prisma.analyticsEvent.count({ where: { event_type: "mood_checkin_completed", occurred_at: { gte: cutoff } } }),
  ]);
  return { app_uses, resource_opens, checkins };
}

/** Usage counts for daily (1 day), weekly (7 days), and monthly (30 days) windows. */
export async function usageBreakdown() {
  const [daily, weekly, monthly] = await Promise.all([
    periodCounts(since(1)),
    periodCounts(since(7)),
    periodCounts(since(30)),
  ]);
  return { daily, weekly, monthly };
}

/** Most-used resource categories over the past 30 days. */
export async function topCategories() {
  const rows = await prisma.analyticsEvent.groupBy({
    by: ["category"],
    where: {
      event_type: "resource_viewed",
      category:   { not: null },
      occurred_at: { gte: since(INSIGHTS_DAYS) },
    },
    _count: { category: true },
    orderBy: { _count: { category: "desc" } },
    take: 5,
  });
  return rows.map((r) => ({ category: r.category!, count: r._count.category }));
}

/** Most-viewed individual resources over the past 30 days. */
export async function topResources() {
  const rows = await prisma.analyticsEvent.groupBy({
    by: ["resource_id"],
    where: {
      event_type:  "resource_viewed",
      resource_id: { not: null },
      occurred_at: { gte: since(INSIGHTS_DAYS) },
    },
    _count: { resource_id: true },
    orderBy: { _count: { resource_id: "desc" } },
    take: 10,
  });
  const ids = rows.map((r) => r.resource_id!);
  const resources = await prisma.resource.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true, category: true },
  });
  const titleMap = Object.fromEntries(resources.map((r) => [r.id, r]));
  return rows.map((r) => ({
    resource_id: r.resource_id!,
    title:       titleMap[r.resource_id!]?.title ?? "Unknown",
    category:    titleMap[r.resource_id!]?.category ?? null,
    count:       r._count.resource_id,
  }));
}

/** Daily check-in completion counts for the past 30 days. */
export async function checkinTrend() {
  const rows = await prisma.analyticsEvent.groupBy({
    by: ["occurred_at"],
    where: {
      event_type:  "mood_checkin_completed",
      occurred_at: { gte: since(INSIGHTS_DAYS) },
    },
    _count: { occurred_at: true },
    orderBy: { occurred_at: "asc" },
  });

  // Bucket by UTC calendar day
  const dayMap: Record<string, number> = {};
  for (const r of rows) {
    const day = r.occurred_at.toISOString().slice(0, 10);
    dayMap[day] = (dayMap[day] ?? 0) + r._count.occurred_at;
  }

  return Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

/** High-level totals for the past 30 days. */
export async function summaryTotals() {
  const cutoff = since(INSIGHTS_DAYS);
  const [checkins, activities, sessions] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { event_type: "mood_checkin_completed", occurred_at: { gte: cutoff } },
    }),
    prisma.analyticsEvent.count({
      where: { event_type: "activity_completed", occurred_at: { gte: cutoff } },
    }),
    prisma.analyticsEvent.count({
      where: { event_type: "session_companion_started", occurred_at: { gte: cutoff } },
    }),
  ]);
  return { checkins, activities, sessions };
}
