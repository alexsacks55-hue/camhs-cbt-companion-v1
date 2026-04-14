import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import { handleRecord } from "../controllers/activities.controller";

const router = Router();
router.use(cookieParser());
router.use(requireAuth);

router.post("/", handleRecord);

export default router;
