import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

// ── Validation schemas ────────────────────────────────────────────────────────

const CATEGORIES = ["anxiety", "low_mood", "behavioural_challenges", "sleep"] as const;
const SECTIONS = ["learn", "activities"] as const;
const STATUSES = ["draft", "published", "hidden", "archived"] as const;
const EXPORT_TYPES = ["none", "blank_template", "structured_summary"] as const;
const JOURNEY_STEPS = ["understand", "try_it", "practise", "review"] as const;
const CONTENT_TYPES = ["text", "pdf", "audio", "video", "worksheet"] as const;
const ROLES = [
  "young_person",
  "parent_carer",
  "practitioner",
  "trainee_practitioner",
  "admin",
] as const;

export const CreateResourceSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  description: z.string().min(1, "Description is required.").max(2000),
  category: z.enum(CATEGORIES),
  section: z.enum(SECTIONS),
  status: z.enum(STATUSES).default("draft"),
  export_type: z.enum(EXPORT_TYPES).default("none"),
  journey_step: z.enum(JOURNEY_STEPS).nullable().optional(),
  content_type: z.enum(CONTENT_TYPES).default("text"),
  file_url: z.string().url("Must be a valid URL.").nullable().optional(),
  typical_session: z.number().int().positive().nullable().optional(),
  sort_order: z.number().int().min(0).default(0),
  video_url: z.string().url("Must be a valid URL.").nullable().optional(),
  video_label: z.string().max(300).nullable().optional(),
  video_placement: z.enum(["top", "below"]).nullable().optional(),
  visibility: z
    .array(z.enum(ROLES))
    .min(1, "At least one role must be able to see this resource."),
});

export const UpdateResourceSchema = CreateResourceSchema.partial();

export const ReorderSchema = z.object({
  items: z.array(
    z.object({ id: z.string().uuid(), sort_order: z.number().int().min(0) })
  ).min(1),
});

export type CreateResourceInput = z.infer<typeof CreateResourceSchema>;
export type UpdateResourceInput = z.infer<typeof UpdateResourceSchema>;

// ── Shared include — always fetch visibility roles with resources ──────────────

const WITH_VISIBILITY = { visibility: true } satisfies Prisma.ResourceInclude;

// Roles that have their resource access restricted by manual_type
const MANUAL_RESTRICTED_ROLES = ["young_person", "parent_carer"] as const;

/**
 * Compute which categories a user may see.
 * young_person and parent_carer: only their manual_type + sleep.
 * All other roles: unrestricted (null = no filter).
 */
function allowedCategories(
  userRole: string,
  userManualType?: string | null,
): (typeof CATEGORIES)[number][] | null {
  if (
    (MANUAL_RESTRICTED_ROLES as readonly string[]).includes(userRole) &&
    userManualType
  ) {
    const manualCat = userManualType as (typeof CATEGORIES)[number];
    return manualCat === "sleep" ? ["sleep"] : [manualCat, "sleep"];
  }
  return null; // no restriction
}

// ── Public queries (role-filtered, published only) ───────────────────────────

export async function listResources(params: {
  userRole: string;
  userManualType?: string | null;
  category?: string;
  section?: string;
}) {
  const allowed = allowedCategories(params.userRole, params.userManualType);

  // If a specific category is requested but is not in the allowed set, return nothing
  if (allowed && params.category && !allowed.includes(params.category as (typeof CATEGORIES)[number])) {
    return [];
  }

  const categoryFilter = params.category
    ? { category: params.category as (typeof CATEGORIES)[number] }
    : allowed
    ? { category: { in: allowed } }
    : {};

  return prisma.resource.findMany({
    where: {
      status: "published",
      ...categoryFilter,
      section: params.section as (typeof SECTIONS)[number] | undefined,
      visibility: { some: { role: params.userRole as (typeof ROLES)[number] } },
    },
    include: WITH_VISIBILITY,
    orderBy: [{ sort_order: "asc" }, { created_at: "asc" }],
  });
}

export async function getResource(id: string, userRole: string, userManualType?: string | null) {
  const allowed = allowedCategories(userRole, userManualType);

  const resource = await prisma.resource.findFirst({
    where: {
      id,
      status: "published",
      ...(allowed ? { category: { in: allowed } } : {}),
      visibility: { some: { role: userRole as (typeof ROLES)[number] } },
    },
    include: WITH_VISIBILITY,
  });
  if (!resource) throw new NotFoundError("Resource not found.");
  return resource;
}

// ── Admin queries (all statuses, unfiltered by role) ─────────────────────────

export async function adminListResources(params: {
  category?: string;
  section?: string;
  status?: string;
}) {
  return prisma.resource.findMany({
    where: {
      category: params.category as (typeof CATEGORIES)[number] | undefined,
      section: params.section as (typeof SECTIONS)[number] | undefined,
      status: params.status as (typeof STATUSES)[number] | undefined,
    },
    include: WITH_VISIBILITY,
    orderBy: [{ category: "asc" }, { sort_order: "asc" }],
  });
}

export async function adminGetResource(id: string) {
  const resource = await prisma.resource.findUnique({
    where: { id },
    include: WITH_VISIBILITY,
  });
  if (!resource) throw new NotFoundError("Resource not found.");
  return resource;
}

export async function createResource(input: CreateResourceInput, createdBy: string) {
  const { visibility, ...fields } = input;

  return prisma.$transaction(async (tx) => {
    const resource = await tx.resource.create({
      data: { ...fields, created_by: createdBy },
    });
    await tx.resourceVisibility.createMany({
      data: visibility.map((role) => ({ resource_id: resource.id, role })),
    });
    return tx.resource.findUniqueOrThrow({
      where: { id: resource.id },
      include: WITH_VISIBILITY,
    });
  });
}

export async function updateResource(id: string, input: UpdateResourceInput) {
  await adminGetResource(id); // 404 if not found

  const { visibility, ...fields } = input;

  return prisma.$transaction(async (tx) => {
    if (fields && Object.keys(fields).length > 0) {
      await tx.resource.update({ where: { id }, data: fields });
    }
    if (visibility !== undefined) {
      await tx.resourceVisibility.deleteMany({ where: { resource_id: id } });
      await tx.resourceVisibility.createMany({
        data: visibility.map((role) => ({ resource_id: id, role })),
      });
    }
    return tx.resource.findUniqueOrThrow({
      where: { id },
      include: WITH_VISIBILITY,
    });
  });
}

export async function deleteResource(id: string) {
  await adminGetResource(id);
  // Visibility rows cascade-delete via FK constraint
  await prisma.resource.delete({ where: { id } });
}

export async function reorderResources(
  items: Array<{ id: string; sort_order: number }>
) {
  await prisma.$transaction(
    items.map(({ id, sort_order }) =>
      prisma.resource.update({ where: { id }, data: { sort_order } })
    )
  );
}

// ── Error types ───────────────────────────────────────────────────────────────

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
