import "dotenv/config";
import { authenticate } from "@ilm/auth-kit";
import { errorHandler, requestLogger } from "@ilm/http-kit";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ?? 4002;

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:5174"
).split(",");

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(requestLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "academic-service", status: "ok" });
});

app.get("/whoiam", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`academic-service listening on http://localhost:${port}`);
});
