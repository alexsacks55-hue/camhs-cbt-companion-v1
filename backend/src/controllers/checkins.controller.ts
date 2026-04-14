import type { Request, Response } from "express";
import {
  createCheckin,
  listCheckins,
  todayCheckin,
  CreateCheckinSchema,
} from "../services/checkins.service";
import { trackEvent } from "../lib/analytics";
import { logger } from "../config/logger";

export async function handleCreate(req: Request, res: Response): Promise<void> {
  const parsed = CreateCheckinSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid check-in data.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const checkin = await createCheckin(req.user!.sub, parsed.data);

    trackEvent({
      event_type: "mood_checkin_completed",
      role_band: req.user!.role,
    });

    res.status(201).json({ data: checkin });
  } catch (err) {
    logger.error("Failed to create check-in", { error: err });
    res.status(500).json({ message: "We couldn't save your check-in. Please try again." });
  }
}

export async function handleList(req: Request, res: Response): Promise<void> {
  const limit = Math.min(Number(req.query.limit) || 7, 30);
  try {
    const checkins = await listCheckins(req.user!.sub, limit);
    res.json({ data: checkins });
  } catch (err) {
    logger.error("Failed to list check-ins", { error: err });
    res.status(500).json({ message: "We couldn't load your check-ins. Please try again." });
  }
}

export async function handleToday(req: Request, res: Response): Promise<void> {
  try {
    const checkin = await todayCheckin(req.user!.sub);
    res.json({ data: checkin ?? null });
  } catch (err) {
    logger.error("Failed to fetch today's check-in", { error: err });
    res.status(500).json({ message: "We couldn't check your recent data. Please try again." });
  }
}
