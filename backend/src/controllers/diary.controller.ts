import type { Request, Response } from "express";
import { list, upsert, UpsertDiarySchema } from "../services/diary.service";
import { logger } from "../config/logger";

function isEligible(req: Request): boolean {
  return req.user!.role === "young_person" && req.user!.manual_type === "low_mood";
}

export async function handleList(req: Request, res: Response): Promise<void> {
  if (!isEligible(req)) {
    res.status(403).json({ message: "This feature is not available for your account." });
    return;
  }
  try {
    const userId = req.user!.sub;
    const days = Number(req.query.days) || 60;
    const entries = await list(userId, days);
    res.json({ data: entries });
  } catch (err) {
    logger.error("Diary list error", { error: err });
    res.status(500).json({ message: "We couldn't load your diary. Please try again." });
  }
}

export async function handleUpsert(req: Request, res: Response): Promise<void> {
  if (!isEligible(req)) {
    res.status(403).json({ message: "This feature is not available for your account." });
    return;
  }
  const parsed = UpsertDiarySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please check your entry and try again.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const userId = req.user!.sub;
    const entry = await upsert(userId, parsed.data);
    res.json({ data: entry });
  } catch (err) {
    logger.error("Diary upsert error", { error: err });
    res.status(500).json({ message: "We couldn't save your diary entry. Please try again." });
  }
}
