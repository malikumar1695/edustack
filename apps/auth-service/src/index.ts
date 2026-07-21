import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ?? 4001;

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "auth-service", status: "ok" });
});

app.listen(port, () => {
  console.log(`auth-service listening on http://localhost:${port}`);
});
