import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { logger } from "../config/logger";

interface AnalyticsEventInput {
  event_type: string;
  resource_id?: string;
  category?: string;
  role_band?: string;
  metadata?: Prisma.InputJsonValue;
}

/**
 * Fires an anonymous analytics event to the separate analytics schema.
 * Fire-and-forget: NEVER throws or blocks the calling request.
 * No individual user identifiers — role_band is the most granular field.
 */
export function trackEvent(input: AnalyticsEventInput): void {
  prisma.analyticsEvent
    .create({ data: input })
    .catch((err) =>
      logger.warn("Analytics event write failed (non-critical)", { error: err })
    );
}
