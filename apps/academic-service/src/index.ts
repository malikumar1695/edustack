import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ?? 4002;

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "academic-service", status: "ok" });
});

app.listen(port, () => {
  console.log(`academic-service listening on http://localhost:${port}`);
});
