import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { handleGetReview } from "../controllers/review.controller";

const router = Router();
router.use(cookieParser());
router.use(requireAuth);
router.use(requireRole("young_person", "parent_carer"));

router.get("/", handleGetReview);

export default router;
