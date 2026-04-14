import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import {
  handleStart,
  handleGet,
  handleAddActivity,
  handleEnd,
} from "../controllers/session.controller";

const router = Router();
router.use(cookieParser());
router.use(requireAuth);

// Practitioner-only: start session
router.post("/start", requireRole("practitioner", "trainee_practitioner", "admin"), handleStart);

// All authenticated: get session by code, add activity
router.get("/:code",            handleGet);
router.post("/:code/activities", handleAddActivity);

// Practitioner-only: end session
router.post("/:code/end", requireRole("practitioner", "trainee_practitioner", "admin"), handleEnd);

export default router;
