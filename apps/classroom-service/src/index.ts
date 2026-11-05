import "dotenv/config";
import "express-async-errors"; // async throws reach errorHandler
import { authenticate } from "@ilm/auth-kit";
import { errorHandler, globalRateLimiter, logger, requestLogger, securityHeaders } from "@ilm/http-kit";
import cors from "cors";
import express from "express";
import { sessionRouter } from "./controllers/session.controller";

const app = express();
const port = process.env.PORT ?? 4004;
app.set("trust proxy", 1);

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:5174"
).split(",");

app.use(securityHeaders);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(requestLogger);
app.use(globalRateLimiter);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "classroom-service", status: "ok" });
});

app.use("/sessions", authenticate, sessionRouter);
app.use(errorHandler);

app.listen(port, () => {
  logger.info({ port }, "classroom-service listening");
});
