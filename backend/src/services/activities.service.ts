import { z } from "zod";
import { prisma } from "../config/database";

export const RecordActivitySchema = z.object({
  resource_id:       z.string().uuid(),
  before_rating:     z.number().int().min(0).max(10).nullable().optional(),
  after_rating:      z.number().int().min(0).max(10).nullable().optional(),
  reflection_choices: z.array(z.string()).default([]),
});

export type RecordActivityInput = z.infer<typeof RecordActivitySchema>;

export async function recordActivity(userId: string, data: RecordActivityInput) {
  return prisma.activityCompletion.create({
    data: {
      user_id:            userId,
      resource_id:        data.resource_id,
      before_rating:      data.before_rating ?? null,
      after_rating:       data.after_rating ?? null,
      reflection_choices: data.reflection_choices,
    },
  });
}

export async function listActivities(userId: string, limit = 20) {
  return prisma.activityCompletion.findMany({
    where: { user_id: userId },
    orderBy: { completed_at: "desc" },
    take: limit,
  });
}
