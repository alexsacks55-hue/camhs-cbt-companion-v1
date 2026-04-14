import "./config/env"; // validate env at startup
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { connectDatabase, disconnectDatabase } from "./config/database";

const app = express();

// ── Security middleware ───────────────────────────────────────────────────────

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
    hsts: { maxAge: 63_072_000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: "no-referrer-when-downgrade" },
    frameguard: { action: "deny" },
    noSniff: true,
  })
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Global rate limit ─────────────────────────────────────────────────────────

app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// ── Health check ──────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: env.NODE_ENV });
});

// ── API routes ────────────────────────────────────────────────────────────────
import authRouter       from "./routes/auth.routes";
import resourcesRouter  from "./routes/resources.routes";
import checkinsRouter   from "./routes/checkins.routes";
import activitiesRouter from "./routes/activities.routes";
import reviewRouter     from "./routes/review.routes";
import patternsRouter   from "./routes/patterns.routes";
import sessionRouter    from "./routes/session.routes";
import insightsRouter   from "./routes/insights.routes";
import diaryRouter      from "./routes/diary.routes";
app.use("/api/v1/auth",              authRouter);
app.use("/api/v1/resources",         resourcesRouter);
app.use("/api/v1/checkins",          checkinsRouter);
app.use("/api/v1/activities",        activitiesRouter);
app.use("/api/v1/review",            reviewRouter);
app.use("/api/v1/patterns",          patternsRouter);
app.use("/api/v1/session-companion", sessionRouter);
app.use("/api/v1/insights",          insightsRouter);
app.use("/api/v1/diary",             diaryRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ── Global error handler ──────────────────────────────────────────────────────

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error("Unhandled error", { message: err.message, stack: err.stack });
    // Never expose stack traces to clients
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
);

// ── Boot ──────────────────────────────────────────────────────────────────────

async function start() {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  logger.error("Failed to start server", { error: err });
  process.exit(1);
});
