import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import {
  handleList,
  handleGet,
  handleAdminList,
  handleAdminGet,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleReorder,
  handleTrackEvent,
} from "../controllers/resources.controller";

const router = Router();

// All resource routes require authentication
router.use(requireAuth);

// ── User-facing routes ────────────────────────────────────────────────────────
// GET /api/v1/resources?category=anxiety&section=learn
router.get("/", handleList);

// GET /api/v1/resources/:id
router.get("/:id", handleGet);

// ── Admin routes ──────────────────────────────────────────────────────────────
const adminOnly = requireRole("admin");

// GET /api/v1/resources/admin/all
router.get("/admin/all", adminOnly, handleAdminList);

// GET /api/v1/resources/admin/:id
router.get("/admin/:id", adminOnly, handleAdminGet);

// POST /api/v1/resources/admin
router.post("/admin", adminOnly, handleCreate);

// PATCH /api/v1/resources/admin/reorder  — must come before /:id
router.patch("/admin/reorder", adminOnly, handleReorder);

// PATCH /api/v1/resources/admin/:id
router.patch("/admin/:id", adminOnly, handleUpdate);

// DELETE /api/v1/resources/admin/:id
router.delete("/admin/:id", adminOnly, handleDelete);

// ── Analytics (any authenticated user) ───────────────────────────────────────
// POST /api/v1/resources/events
router.post("/events", handleTrackEvent);

export default router;
