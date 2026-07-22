import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ?? 4002;

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:5174"
).split(",");

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "academic-service", status: "ok" });
});

app.listen(port, () => {
  console.log(`academic-service listening on http://localhost:${port}`);
});
