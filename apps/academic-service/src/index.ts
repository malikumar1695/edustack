import "dotenv/config";
import "express-async-errors"; // async throws reach errorHandler
import { authenticate } from "@ilm/auth-kit";
import { errorHandler, logger, requestLogger, securityHeaders, globalRateLimiter } from "@ilm/http-kit";
import cors from "cors";
import express from "express";
import { studentRouter } from "./controllers/student.controller";

const app = express();
const port = process.env.PORT ?? 4002;
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
  res.json({ service: "academic-service", status: "ok" });
});

app.get("/whoiam", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.use("/students", authenticate, studentRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`academic-service listening on http://localhost:${port}`);
  logger.info({ port }, `academic-service listening`);
});
