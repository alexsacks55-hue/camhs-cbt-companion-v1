import bcrypt from "bcryptjs";
import { env } from "../config/env";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, env.BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Zod-compatible password strength rule (min 12 chars). */
export const PASSWORD_MIN_LENGTH = 12;
