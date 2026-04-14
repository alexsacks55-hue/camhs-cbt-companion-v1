import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { handleGetPatterns } from "../controllers/patterns.controller";

const router = Router();
router.use(cookieParser());
router.use(requireAuth);
router.use(requireRole("young_person", "parent_carer"));

router.get("/", handleGetPatterns);

export default router;
