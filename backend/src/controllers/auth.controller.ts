import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../config/env";
import {
  register,
  login,
  refresh,
  logout,
  getById,
  RegisterSchema,
  LoginSchema,
  ConflictError,
  UnauthorizedError,
} from "../services/auth.service";
import { logger } from "../config/logger";

// Tighter rate limit for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many attempts. Please wait a moment before trying again.",
  },
});

const REFRESH_COOKIE_NAME = "refresh_token";
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: "/api/v1/auth",
};

export async function handleRegister(req: Request, res: Response): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please check the form and try again.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const { user, accessToken, refreshToken } = await register(parsed.data);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(201).json({ data: { user, access_token: accessToken } });
  } catch (err) {
    if (err instanceof ConflictError) {
      res.status(409).json({ message: err.message });
      return;
    }
    logger.error("Register error", { error: err });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    const { user, accessToken, refreshToken } = await login(parsed.data);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(200).json({ data: { user, access_token: accessToken } });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      res.status(401).json({ message: err.message });
      return;
    }
    logger.error("Login error", { error: err });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function handleRefresh(req: Request, res: Response): Promise<void> {
  const incomingToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  if (!incomingToken) {
    res.status(401).json({ message: "Session expired. Please sign in again." });
    return;
  }

  try {
    const { accessToken, refreshToken } = await refresh(incomingToken);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(200).json({ data: { access_token: accessToken } });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/v1/auth" });
      res.status(401).json({ message: err.message });
      return;
    }
    logger.error("Refresh error", { error: err });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function handleLogout(req: Request, res: Response): Promise<void> {
  const userId = req.user?.sub;
  if (userId) {
    try {
      await logout(userId);
    } catch (err) {
      logger.warn("Logout cleanup failed", { userId, error: err });
    }
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/v1/auth" });
  res.status(200).json({ data: { message: "Signed out successfully." } });
}

export async function handleMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await getById(req.user!.sub);
    res.status(200).json({ data: { user } });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      res.status(401).json({ message: err.message });
      return;
    }
    logger.error("Me error", { error: err });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
