import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import {
  authRateLimit,
  handleRegister,
  handleLogin,
  handleRefresh,
  handleLogout,
  handleMe,
} from "../controllers/auth.controller";

const router = Router();

// cookie-parser is needed to read the refresh_token cookie
router.use(cookieParser());

// POST /api/v1/auth/register
router.post("/register", authRateLimit, handleRegister);

// POST /api/v1/auth/login
router.post("/login", authRateLimit, handleLogin);

// POST /api/v1/auth/refresh  — reads refresh_token cookie, returns new access token
router.post("/refresh", handleRefresh);

// POST /api/v1/auth/logout  — clears refresh_token cookie, invalidates server-side token
router.post("/logout", requireAuth, handleLogout);

// GET /api/v1/auth/me  — returns current user from token
router.get("/me", requireAuth, handleMe);

export default router;
