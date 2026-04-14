import { Router } from "express";
import cookieParser from "cookie-parser";
import { requireAuth } from "../middleware/auth";
import { handleList, handleUpsert } from "../controllers/diary.controller";

const router = Router();
router.use(cookieParser());
router.use(requireAuth);

router.get("/", handleList);
router.post("/", handleUpsert);

export default router;
