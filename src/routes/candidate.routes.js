import { Router } from "express";
import upload from "../config/multer.js";
import Candidate from "../models/Candidate.js";
import {
  createCandidate,
  getCandidates,
  getCandidate,
  updateCandidate,
  uploadDocuments,
  removeDocument,
  stats,
} from "../controllers/candidate.controller.js";

const router = Router();

/* =========================================================
   CANDIDATE CRUD
   ========================================================= */

// Create candidate (Admin + Public /apply)
router.post("/", createCandidate);

// Get paginated candidates (search + filter + pagination)
router.get("/", getCandidates);

// Dashboard stats
router.get("/stats", stats);

// Get single candidate (detail / profile view)
router.get("/:id", getCandidate);

// Update candidate (edit form / status change)
router.put("/:id", updateCandidate);

// DELETE candidate (from Candidate List)
router.delete("/:id", async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.sendStatus(404);
    }

    await Candidate.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

/* =========================================================
   DOCUMENT MANAGEMENT
   ========================================================= */

// Upload or replace documents
router.post(
  "/:id/documents",
  upload.any(),
  uploadDocuments
);

// Remove a single document (photo / aadharFront / aadharBack)
router.delete(
  "/:id/documents/:field",
  removeDocument
);

export default router;
