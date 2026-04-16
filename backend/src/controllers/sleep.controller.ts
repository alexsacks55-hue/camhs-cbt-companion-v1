import type { Request, Response } from "express";
import {
  listSleepDiary, upsertSleepDiary, UpsertSleepDiarySchema,
  getWindDown, upsertWindDown, UpsertWindDownSchema,
  listWindDownLogs, upsertWindDownLog, UpsertWindDownLogSchema,
} from "../services/sleep.service";
import { logger } from "../config/logger";

// ── Sleep diary ────────────────────────────────────────────────────────────────

export async function handleListSleepDiary(req: Request, res: Response): Promise<void> {
  try {
    const days = Number(req.query.days) || 60;
    const entries = await listSleepDiary(req.user!.sub, days);
    res.json({ data: entries });
  } catch (err) {
    logger.error("Sleep diary list error", { error: err });
    res.status(500).json({ message: "We couldn't load your sleep diary. Please try again." });
  }
}

export async function handleUpsertSleepDiary(req: Request, res: Response): Promise<void> {
  const parsed = UpsertSleepDiarySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please check your entry and try again.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }
  try {
    const entry = await upsertSleepDiary(req.user!.sub, parsed.data);
    res.json({ data: entry });
  } catch (err) {
    logger.error("Sleep diary upsert error", { error: err });
    res.status(500).json({ message: "We couldn't save your sleep entry. Please try again." });
  }
}

// ── Wind-down routine ──────────────────────────────────────────────────────────

export async function handleGetWindDown(req: Request, res: Response): Promise<void> {
  try {
    const routine = await getWindDown(req.user!.sub);
    res.json({ data: routine });
  } catch (err) {
    logger.error("Wind-down get error", { error: err });
    res.status(500).json({ message: "We couldn't load your routine. Please try again." });
  }
}

export async function handleUpsertWindDown(req: Request, res: Response): Promise<void> {
  const parsed = UpsertWindDownSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please check your routine and try again.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }
  try {
    const routine = await upsertWindDown(req.user!.sub, parsed.data);
    res.json({ data: routine });
  } catch (err) {
    logger.error("Wind-down upsert error", { error: err });
    res.status(500).json({ message: "We couldn't save your routine. Please try again." });
  }
}

// ── Wind-down logs ─────────────────────────────────────────────────────────────

export async function handleListWindDownLogs(req: Request, res: Response): Promise<void> {
  try {
    const days = Number(req.query.days) || 14;
    const logs = await listWindDownLogs(req.user!.sub, days);
    res.json({ data: logs });
  } catch (err) {
    logger.error("Wind-down logs list error", { error: err });
    res.status(500).json({ message: "We couldn't load your completion history. Please try again." });
  }
}

export async function handleUpsertWindDownLog(req: Request, res: Response): Promise<void> {
  const parsed = UpsertWindDownLogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please check your entry and try again.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }
  try {
    const log = await upsertWindDownLog(req.user!.sub, parsed.data);
    res.json({ data: log });
  } catch (err) {
    logger.error("Wind-down log upsert error", { error: err });
    res.status(500).json({ message: "We couldn't save your completion. Please try again." });
  }
}
