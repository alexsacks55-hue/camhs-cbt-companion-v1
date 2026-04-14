import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { handleGetInsights } from "../controllers/insights.controller";

const router = Router();
router.use(cookieParser());
router.use(requireAuth);
router.use(requireRole("practitioner", "trainee_practitioner", "admin"));

router.get("/", handleGetInsights);

export default router;
