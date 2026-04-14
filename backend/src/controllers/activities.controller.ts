import type { Request, Response } from "express";
import { recordActivity, RecordActivitySchema } from "../services/activities.service";
import { trackEvent } from "../lib/analytics";
import { logger } from "../config/logger";

export async function handleRecord(req: Request, res: Response): Promise<void> {
  const parsed = RecordActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid activity data.", fieldErrors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const activity = await recordActivity(req.user!.sub, parsed.data);

    trackEvent({
      event_type:  "activity_completed",
      resource_id: parsed.data.resource_id,
      role_band:   req.user!.role,
    });

    res.status(201).json({ data: activity });
  } catch (err) {
    logger.error("Failed to record activity", { error: err });
    res.status(500).json({ message: "We couldn't save this. Please try again." });
  }
}
