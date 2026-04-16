import { z } from "zod";
import { prisma } from "../config/database";
import { hashPassword, verifyPassword, PASSWORD_MIN_LENGTH } from "../lib/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { logger } from "../config/logger";

// ── Validation schemas ────────────────────────────────────────────────────────

const VALID_ROLES = [
  "young_person",
  "parent_carer",
  "practitioner",
  "trainee_practitioner",
  "admin",
] as const;

const VALID_AGE_BANDS = [
  "under_11",
  "eleven_to_fifteen",
  "sixteen_to_eighteen",
  "adult",
] as const;

const VALID_MANUAL_TYPES = [
  "anxiety",
  "low_mood",
  "behavioural_challenges",
  "sleep",
] as const;

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username must be 50 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens."
    ),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`),
  role: z.enum(VALID_ROLES),
  age_band: z.enum(VALID_AGE_BANDS).optional(),
  consent_given: z.boolean(),
  parental_aware: z.boolean().optional().default(false),
  manual_type: z.enum(VALID_MANUAL_TYPES).optional(),
});

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// ── Service functions ──────────────────────────────────────────────────────────

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { username: input.username },
  });
  if (existing) {
    throw new ConflictError("That username is already taken. Please choose another.");
  }

  const password_hash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      username:     input.username,
      password_hash,
      role:         input.role,
      age_band:     input.age_band ?? null,
      consent_given: input.consent_given,
      parental_aware: input.parental_aware ?? false,
      manual_type:  input.manual_type ?? null,
    },
  });

  const { accessToken, refreshToken } = await issueTokenPair(user.id, user.username, user.role, user.manual_type);

  logger.info("User registered", { userId: user.id, role: user.role });

  return { user: safeUser(user), accessToken, refreshToken };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { username: input.username },
  });

  // Constant-time comparison path — don't reveal whether user exists
  const validPassword =
    user !== null && (await verifyPassword(input.password, user.password_hash));

  if (!user || !validPassword) {
    throw new UnauthorizedError("Username or password not recognised.");
  }

  const { accessToken, refreshToken } = await issueTokenPair(user.id, user.username, user.role, user.manual_type);

  logger.info("User logged in", { userId: user.id, role: user.role });

  return { user: safeUser(user), accessToken, refreshToken };
}

export async function refresh(incomingRefreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(incomingRefreshToken) as { sub: string };
  } catch {
    throw new UnauthorizedError("Session expired. Please sign in again.");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.refresh_token_hash) {
    throw new UnauthorizedError("Session expired. Please sign in again.");
  }

  const { verifyPassword: verifyHash } = await import("../lib/password");
  const valid = await verifyHash(incomingRefreshToken, user.refresh_token_hash);
  if (!valid) {
    throw new UnauthorizedError("Session expired. Please sign in again.");
  }

  const { accessToken, refreshToken } = await issueTokenPair(user.id, user.username, user.role, user.manual_type);
  return { accessToken, refreshToken };
}

export async function logout(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { refresh_token_hash: null },
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function issueTokenPair(userId: string, username: string, role: string, manualType?: string | null) {
  const accessToken = signAccessToken({ sub: userId, username, role, manual_type: manualType ?? null });
  const refreshToken = signRefreshToken(userId);
  const tokenHash = await hashPassword(refreshToken);

  await prisma.user.update({
    where: { id: userId },
    data: { refresh_token_hash: tokenHash },
  });

  return { accessToken, refreshToken };
}

function safeUser(user: {
  id: string;
  username: string;
  role: string;
  age_band: string | null;
  consent_given: boolean;
  parental_aware: boolean;
  manual_type: string | null;
  created_at: Date;
  updated_at: Date;
  [key: string]: unknown;
}) {
  return {
    id:             user.id,
    username:       user.username,
    role:           user.role,
    age_band:       user.age_band,
    consent_given:  user.consent_given,
    parental_aware: user.parental_aware,
    manual_type:    user.manual_type,
    created_at:     user.created_at,
    updated_at:     user.updated_at,
  };
}

export async function getById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UnauthorizedError("User not found.");
  return safeUser(user);
}

export const ChangePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required."),
  new_password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `New password must be at least ${PASSWORD_MIN_LENGTH} characters.`),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UnauthorizedError("User not found.");

  const valid = await verifyPassword(input.current_password, user.password_hash);
  if (!valid) throw new UnauthorizedError("Current password is incorrect.");

  const new_hash = await hashPassword(input.new_password);
  await prisma.user.update({ where: { id: userId }, data: { password_hash: new_hash } });

  logger.info("Password changed", { userId });
}

// ── Error types ───────────────────────────────────────────────────────────────

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
