import type { Request, Response } from "express";
import { getWeeklyReview } from "../services/review.service";
import { trackEvent } from "../lib/analytics";
import { logger } from "../config/logger";

export async function handleGetReview(req: Request, res: Response): Promise<void> {
  try {
    const review = await getWeeklyReview(req.user!.sub);

    trackEvent({ event_type: "weekly_review_viewed", role_band: req.user!.role });

    res.json({ data: review });
  } catch (err) {
    logger.error("Failed to generate weekly review", { error: err });
    res.status(500).json({ message: "We couldn't load your review right now. Please try again." });
  }
}
