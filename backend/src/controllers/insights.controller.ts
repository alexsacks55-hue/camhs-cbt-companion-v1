import type { Request, Response } from "express";
import { usageBreakdown } from "../services/insights.service";
import { logger } from "../config/logger";

export async function handleGetInsights(_req: Request, res: Response): Promise<void> {
  try {
    const breakdown = await usageBreakdown();
    res.json({ data: breakdown });
  } catch (err) {
    logger.error("Failed to load insights", { error: err });
    res.status(500).json({ message: "We couldn't load service insights right now. Please try again." });
  }
}
