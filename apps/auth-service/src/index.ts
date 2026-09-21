import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import { accountRouter } from "./controllers/account.controller";
import { errorHandler } from "@ilm/http-kit";
import { requestLogger } from "@ilm/http-kit";
import { logger } from "@ilm/http-kit";
import { userRouter } from "./controllers/user.controller";
import { roleRouter } from "./controllers/role.controller";
import { securityHeaders, globalRateLimiter } from "@ilm/http-kit";

const app = express();
const port = process.env.PORT ?? 4001;

// Render / Cloud Run terminate TLS and forward requests, so without this
// req.ip is the proxy's address — every client would share one rate-limit
// bucket, and express-rate-limit refuses to run with a spoofable IP.
app.set("trust proxy", 1);


// Next.js's BFF proxy calls this server-to-server (CORS doesn't apply
// there — it's a browser-only mechanism). This list is for apps that
// call it straight from the browser, like apps/admin.
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:5174"
).split(",");

app.use(securityHeaders);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(requestLogger);
app.use(globalRateLimiter);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ service: "auth-service", status: "ok" });
});

app.use("/auth", accountRouter);
app.use("/users", userRouter);
app.use("/roles", roleRouter);
app.use(errorHandler);

app.listen(port, () => {
  logger.info({ port }, `auth-service listening`);
});
