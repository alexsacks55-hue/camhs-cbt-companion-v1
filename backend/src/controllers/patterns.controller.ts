import type { Request, Response } from "express";
import { evaluatePatterns } from "../services/patterns.service";
import { logger } from "../config/logger";

export async function handleGetPatterns(req: Request, res: Response): Promise<void> {
  try {
    const patterns = await evaluatePatterns(req.user!.sub);
    res.json({ data: patterns });
  } catch (err) {
    logger.error("Failed to evaluate patterns", { error: err });
    res.status(500).json({ message: "We couldn't load your patterns right now. Please try again." });
  }
}
