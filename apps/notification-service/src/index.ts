import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ?? 4003;

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "notification-service", status: "ok" });
});

app.listen(port, () => {
  console.log(`notification-service listening on http://localhost:${port}`);
});
