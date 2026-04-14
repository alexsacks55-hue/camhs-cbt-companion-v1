import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

// Single PrismaClient instance — reused across the process lifetime.
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["warn", "error"],
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Failed to connect to database", { error });
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info("Database disconnected");
}
