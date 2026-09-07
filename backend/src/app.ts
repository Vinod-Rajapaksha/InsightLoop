import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";

import { authRoutes } from "./modules/auth/auth.routes";
import { projectRoutes } from "./modules/projects/project.routes";
import { reportRoutes } from "./modules/reports/report.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import aiRoutes from "./modules/ai/ai.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InsightLoop API is running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/manager/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
