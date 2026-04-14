import { z } from "zod";
import { prisma } from "../config/database";

// ── Constants ─────────────────────────────────────────────────────────────────

const INACTIVITY_MINUTES = 10;
const CODE_LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ"; // No I, L, O to avoid confusion

// ── Validation ────────────────────────────────────────────────────────────────

export const AddActivitySchema = z.object({
  activity_type: z.literal("mood_snapshot"),
  activity_data: z.object({
    mood_rating:    z.number().int().min(0).max(10),
    anxiety_rating: z.number().int().min(0).max(10),
    emotions:       z.array(z.string()).default([]),
  }),
});

export type AddActivityInput = z.infer<typeof AddActivitySchema>;

// ── Errors ────────────────────────────────────────────────────────────────────

export class SessionNotFoundError extends Error {}
export class SessionExpiredError extends Error {}
export class SessionEndedError extends Error {}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateCode(): string {
  const l = () => CODE_LETTERS[Math.floor(Math.random() * CODE_LETTERS.length)];
  const d = () => Math.floor(Math.random() * 10).toString();
  return `${l()}${l()}${l()}-${d()}${d()}${d()}`;
}

function expiresAt(): Date {
  const d = new Date();
  d.setMinutes(d.getMinutes() + INACTIVITY_MINUTES);
  return d;
}

async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateCode();
    const existing = await prisma.sessionCompanion.findUnique({ where: { session_code: code } });
    if (!existing) return code;
  }
  throw new Error("Could not generate unique session code.");
}

function assertActive(session: { is_active: boolean; expires_at: Date; ended_at: Date | null }) {
  if (!session.is_active || session.ended_at !== null) throw new SessionEndedError("Session has ended.");
  if (session.expires_at < new Date()) throw new SessionExpiredError("Session has expired.");
}

// ── Service ───────────────────────────────────────────────────────────────────

export async function startSession(practitionerId: string) {
  const code = await uniqueCode();
  return prisma.sessionCompanion.create({
    data: {
      session_code:    code,
      practitioner_id: practitionerId,
      expires_at:      expiresAt(),
    },
    include: { activities: true },
  });
}

export async function getSession(code: string) {
  const session = await prisma.sessionCompanion.findUnique({
    where: { session_code: code.toUpperCase() },
    include: { activities: { orderBy: { created_at: "asc" } } },
  });
  if (!session) throw new SessionNotFoundError("Session not found.");

  // Auto-expire stale sessions
  if (session.is_active && !session.ended_at && session.expires_at < new Date()) {
    await prisma.sessionCompanion.update({
      where: { id: session.id },
      data: { is_active: false },
    });
    throw new SessionExpiredError("Session has expired.");
  }

  return session;
}

export async function addActivity(code: string, data: AddActivityInput) {
  const session = await getSession(code);
  assertActive(session);

  const [activity] = await prisma.$transaction([
    prisma.sessionCompanionActivity.create({
      data: {
        session_id:    session.id,
        activity_type: data.activity_type,
        activity_data: data.activity_data,
      },
    }),
    prisma.sessionCompanion.update({
      where: { id: session.id },
      data: { expires_at: expiresAt(), last_active_at: new Date() },
    }),
  ]);
  return activity;
}

export async function endSession(code: string, practitionerId: string) {
  const session = await getSession(code);
  if (session.practitioner_id !== practitionerId) {
    throw new Error("Only the practitioner who started this session can end it.");
  }
  return prisma.sessionCompanion.update({
    where: { id: session.id },
    data: { is_active: false, ended_at: new Date() },
  });
}

/**
 * Purge all session data for sessions that ended or expired more than 1 hour ago.
 * Called lazily on each start-session request (no cron needed for V1).
 */
export async function purgeExpiredSessions() {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 1);

  const expired = await prisma.sessionCompanion.findMany({
    where: {
      OR: [
        { is_active: false, ended_at: { lt: cutoff } },
        { is_active: true, expires_at: { lt: cutoff } },
      ],
    },
    select: { id: true },
  });

  if (expired.length > 0) {
    await prisma.sessionCompanion.deleteMany({
      where: { id: { in: expired.map((s) => s.id) } },
    });
  }
}
