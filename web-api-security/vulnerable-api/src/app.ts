import cors from "cors";
import express from "express";
import { getLabMode } from "./config.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { documentsRouter } from "./routes/documents.js";
import { healthRouter } from "./routes/health.js";
import { meRouter } from "./routes/me.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));
  app.use(
    cors({
      origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    }),
  );

  app.use((req, res, next) => {
    res.setHeader("X-Lab-Mode", getLabMode());
    next();
  });

  app.use("/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/me", meRouter);
  app.use("/api/documents", documentsRouter);
  app.use("/api/admin", adminRouter);

  app.use(errorHandler);

  return app;
}
