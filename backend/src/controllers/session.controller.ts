import type { Request, Response } from "express";
import {
  startSession,
  getSession,
  addActivity,
  endSession,
  purgeExpiredSessions,
  AddActivitySchema,
  SessionNotFoundError,
  SessionExpiredError,
  SessionEndedError,
} from "../services/session.service";
import { trackEvent } from "../lib/analytics";
import { logger } from "../config/logger";

export async function handleStart(req: Request, res: Response): Promise<void> {
  try {
    // Lazily purge stale sessions on each new start
    purgeExpiredSessions().catch((e) => logger.warn("Session purge failed", { error: e }));

    const session = await startSession(req.user!.sub);

    trackEvent({ event_type: "session_companion_started", role_band: req.user!.role });

    res.status(201).json({ data: { session_code: session.session_code, id: session.id, expires_at: session.expires_at } });
  } catch (err) {
    logger.error("Failed to start session", { error: err });
    res.status(500).json({ message: "We couldn't start a session right now. Please try again." });
  }
}

export async function handleGet(req: Request, res: Response): Promise<void> {
  const code = req.params.code?.toUpperCase();
  try {
    const session = await getSession(code);
    res.json({ data: session });
  } catch (err) {
    if (err instanceof SessionNotFoundError) {
      res.status(404).json({ message: "Session not found. Check the code and try again." });
      return;
    }
    if (err instanceof SessionExpiredError) {
      res.status(410).json({ message: "This session has expired." });
      return;
    }
    if (err instanceof SessionEndedError) {
      res.status(410).json({ message: "This session has ended." });
      return;
    }
    logger.error("Failed to get session", { error: err });
    res.status(500).json({ message: "We couldn't load the session. Please try again." });
  }
}

export async function handleAddActivity(req: Request, res: Response): Promise<void> {
  const code = req.params.code?.toUpperCase();
  const parsed = AddActivitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid activity data.", fieldErrors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const activity = await addActivity(code, parsed.data);

    trackEvent({ event_type: "activity_completed", role_band: req.user!.role });

    res.status(201).json({ data: activity });
  } catch (err) {
    if (err instanceof SessionNotFoundError) { res.status(404).json({ message: "Session not found." }); return; }
    if (err instanceof SessionExpiredError)  { res.status(410).json({ message: "This session has expired." }); return; }
    if (err instanceof SessionEndedError)    { res.status(410).json({ message: "This session has ended." }); return; }
    logger.error("Failed to add activity", { error: err });
    res.status(500).json({ message: "We couldn't save the activity. Please try again." });
  }
}

export async function handleEnd(req: Request, res: Response): Promise<void> {
  const code = req.params.code?.toUpperCase();
  try {
    await endSession(code, req.user!.sub);
    res.json({ data: { ended: true } });
  } catch (err) {
    if (err instanceof SessionNotFoundError) { res.status(404).json({ message: "Session not found." }); return; }
    if (err instanceof SessionExpiredError)  { res.status(410).json({ message: "Session already expired." }); return; }
    logger.error("Failed to end session", { error: err });
    res.status(500).json({ message: "We couldn't end the session. Please try again." });
  }
}
