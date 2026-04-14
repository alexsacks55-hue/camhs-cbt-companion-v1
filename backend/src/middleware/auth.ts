import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, AccessTokenPayload } from "../lib/jwt";

// Extend Express Request to carry the verified token payload
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches the decoded payload to req.user.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  const token = header.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please sign in again." });
  }
}
