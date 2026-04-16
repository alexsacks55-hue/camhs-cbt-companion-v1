import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import {
  handleListSleepDiary, handleUpsertSleepDiary,
  handleGetWindDown,    handleUpsertWindDown,
} from "../controllers/sleep.controller";

const router = Router();
router.use(cookieParser());
router.use(requireAuth);

// Sleep diary
router.get("/diary",  handleListSleepDiary);
router.post("/diary", handleUpsertSleepDiary);

// Wind-down routine
router.get("/wind-down",  handleGetWindDown);
router.post("/wind-down", handleUpsertWindDown);

export default router;
