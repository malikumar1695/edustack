import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import { accountRouter } from "./controllers/account.controller";
import { errorHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { logger } from "./lib/logger";

const app = express();
const port = process.env.PORT ?? 4001;

// Next.js's BFF proxy calls this server-to-server (CORS doesn't apply
// there — it's a browser-only mechanism). This list is for apps that
// call it straight from the browser, like apps/admin.
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:5174"
).split(",");

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ service: "auth-service", status: "ok" });
});

app.use("/auth", accountRouter);
app.use(errorHandler);

app.listen(port, () => {
  logger.info({ port }, `auth-service listening`);
});
