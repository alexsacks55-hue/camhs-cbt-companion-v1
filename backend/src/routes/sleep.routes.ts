import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import {
  handleListSleepDiary, handleUpsertSleepDiary,
  handleGetWindDown,    handleUpsertWindDown,
  handleListWindDownLogs, handleUpsertWindDownLog,
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

// Wind-down daily completion logs
router.get("/wind-down/logs",  handleListWindDownLogs);
router.post("/wind-down/logs", handleUpsertWindDownLog);

export default router;
