import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import candidateRoutes from "./routes/candidate.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("json spaces", 2);
app.use(cors());
app.use(express.json());

/* ================= ROOT STATUS ================= */
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Admin Dashboard API is running",
    endpoints: {
      candidates: "/api/candidates"
    }
  });
});

/* ================= SERVE UPLOADS (CRITICAL) ================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

/* ================= ROUTES ================= */
app.use("/api/candidates", candidateRoutes);

export default app;
