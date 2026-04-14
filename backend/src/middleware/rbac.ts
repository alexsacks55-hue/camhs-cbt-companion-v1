import { Request, Response, NextFunction } from "express";

/**
 * Checks that the authenticated user has one of the allowed roles.
 * Must be used after requireAuth.
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      res.status(403).json({
        message: "This area is not available for your account.",
      });
      return;
    }
    next();
  };
}
