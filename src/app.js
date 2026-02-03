import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import candidateRoutes from "./routes/candidate.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

/* ================= SERVE UPLOADS (CRITICAL) ================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

/* ================= ROUTES ================= */
app.use("/api/candidates", candidateRoutes);


/* ================= SERVE FRONTEND (BUILD) ================= */
const __frontendPath = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(express.static(__frontendPath));

/* ================= SPA FALLBACK ================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__frontendPath, "index.html"));
});



export default app;
