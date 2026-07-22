import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ?? 4001;

// Next.js's BFF proxy calls this server-to-server (CORS doesn't apply
// there — it's a browser-only mechanism). This list is for apps that
// call it straight from the browser, like apps/admin.
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:5174"
).split(",");

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "auth-service", status: "ok" });
});

app.listen(port, () => {
  console.log(`auth-service listening on http://localhost:${port}`);
});
