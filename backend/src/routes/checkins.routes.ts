import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import {
  handleCreate,
  handleList,
  handleToday,
} from "../controllers/checkins.controller";

const router = Router();
router.use(cookieParser());
router.use(requireAuth);

// GET /today must come before GET /:id-style routes to avoid route shadowing
router.get("/today", handleToday);
router.get("/", handleList);
router.post("/", handleCreate);

export default router;
