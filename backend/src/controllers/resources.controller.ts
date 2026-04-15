import { Request, Response } from "express";
import {
  listResources,
  getResource,
  adminListResources,
  adminGetResource,
  createResource,
  updateResource,
  deleteResource,
  reorderResources,
  CreateResourceSchema,
  UpdateResourceSchema,
  ReorderSchema,
  NotFoundError,
} from "../services/resources.service";
import { trackEvent } from "../lib/analytics";
import { logger } from "../config/logger";

// ── User-facing handlers ──────────────────────────────────────────────────────

export async function handleList(req: Request, res: Response): Promise<void> {
  const userRole = req.user!.role;
  const userManualType = req.user!.manual_type;
  const { category, section } = req.query as Record<string, string | undefined>;

  const resources = await listResources({ userRole, userManualType, category, section });
  res.json({ data: resources });
}

export async function handleGet(req: Request, res: Response): Promise<void> {
  try {
    const resource = await getResource(req.params.id, req.user!.role, req.user!.manual_type);

    // Fire analytics event — anonymous, fire-and-forget
    trackEvent({
      event_type: "resource_viewed",
      resource_id: resource.id,
      category: resource.category,
      role_band: req.user!.role,
    });

    res.json({ data: resource });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
      return;
    }
    throw err;
  }
}

// ── Admin handlers ────────────────────────────────────────────────────────────

export async function handleAdminList(req: Request, res: Response): Promise<void> {
  const { category, section, status } = req.query as Record<string, string | undefined>;
  const resources = await adminListResources({ category, section, status });
  res.json({ data: resources });
}

export async function handleAdminGet(req: Request, res: Response): Promise<void> {
  try {
    const resource = await adminGetResource(req.params.id);
    res.json({ data: resource });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
      return;
    }
    throw err;
  }
}

export async function handleCreate(req: Request, res: Response): Promise<void> {
  const parsed = CreateResourceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please check the form and try again.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const resource = await createResource(parsed.data, req.user!.sub);
    trackEvent({ event_type: "resource_created", category: resource.category });
    res.status(201).json({ data: resource });
  } catch (err) {
    logger.error("Create resource error", { error: err });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function handleUpdate(req: Request, res: Response): Promise<void> {
  const parsed = UpdateResourceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please check the form and try again.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const resource = await updateResource(req.params.id, parsed.data);
    res.json({ data: resource });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
      return;
    }
    logger.error("Update resource error", { error: err });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function handleDelete(req: Request, res: Response): Promise<void> {
  try {
    await deleteResource(req.params.id);
    res.json({ data: { message: "Resource deleted." } });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
      return;
    }
    logger.error("Delete resource error", { error: err });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function handleReorder(req: Request, res: Response): Promise<void> {
  const parsed = ReorderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid reorder payload.", errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await reorderResources(parsed.data.items as Array<{ id: string; sort_order: number }>);
    res.json({ data: { message: "Order updated." } });
  } catch (err) {
    logger.error("Reorder resources error", { error: err });
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

// ── Analytics event endpoint (Phase 11 aggregation built later) ───────────────

export async function handleTrackEvent(req: Request, res: Response): Promise<void> {
  const { event_type, resource_id, category } = req.body as {
    event_type: string;
    resource_id?: string;
    category?: string;
  };
  if (!event_type) {
    res.status(400).json({ message: "event_type is required." });
    return;
  }
  trackEvent({ event_type, resource_id, category, role_band: req.user?.role });
  res.status(202).json({ data: { recorded: true } });
}
