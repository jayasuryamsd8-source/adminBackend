import Candidate from "../models/Candidate.js";
import fs from "fs";
import path from "path";

/* =========================================================
   UTILITY — CLEAN EMPTY ARRAY ITEMS
   ========================================================= */
function cleanArray(arr = [], requiredKeys = []) {
  return arr.filter(item =>
    requiredKeys.every(
      key => item[key] && item[key].toString().trim()
    )
  );
}

/* =========================================================
   CREATE CANDIDATE
   (ALWAYS SET STATUS = NEW)
   ========================================================= */
export const createCandidate = async (req, res, next) => {
  try {
    const data = { ...req.body };

    // 🔒 Force default status
    if (!data.status) {
      data.status = "NEW";
    }

    // Clean array fields
    data.familyDetails = cleanArray(
      data.familyDetails,
      ["name", "relation"]
    );

    data.education = cleanArray(
      data.education,
      ["degree", "institution"]
    );

    data.experience = cleanArray(
      data.experience,
      ["company", "role"]
    );

    const candidate = await Candidate.create(data);
    res.status(201).json(candidate);
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   GET PAGINATED CANDIDATES
   ========================================================= */
export const getCandidates = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const { search, status } = req.query;

    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Candidate.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Candidate.countDocuments(query),
    ]);

    res.json({ items, total });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   GET SINGLE CANDIDATE
   ========================================================= */
export const getCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json(candidate);
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   UPDATE CANDIDATE (STATUS MACHINE SAFE)
   ========================================================= */
export const updateCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const current = candidate.status;
    const nextStatus = req.body.status;

    const ALLOWED_TRANSITIONS = {
      NEW: ["REVIEWING"],
      REVIEWING: ["SHORTLISTED", "REJECTED"],
      SHORTLISTED: ["HIRED", "REJECTED"],
      HIRED: [],
      REJECTED: [],
    };

    if (
      nextStatus &&
      !ALLOWED_TRANSITIONS[current]?.includes(nextStatus)
    ) {
      return res.status(400).json({
        message: `Invalid status transition: ${current} → ${nextStatus}`,
      });
    }

    candidate.status = nextStatus ?? candidate.status;
    await candidate.save();

    res.json(candidate);
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   DASHBOARD STATS (✅ FIXED, NORMALIZED, TRUSTED)
   ========================================================= */
export const stats = async (_req, res, next) => {
  try {
    const result = await Candidate.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Single source of truth
    const stats = {
      total: 0,
      NEW: 0,
      REVIEWING: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
      HIRED: 0,
    };

    for (const row of result) {
      if (stats[row._id] !== undefined) {
        stats[row._id] = row.count;
        stats.total += row.count;
      }
    }

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   UPLOAD / REPLACE DOCUMENTS
   ========================================================= */
export const uploadDocuments = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const updates = {};

    for (const file of req.files) {
      if (["photo", "aadharFront", "aadharBack"].includes(file.fieldname)) {
        updates[`documents.${file.fieldname}`] =
          `uploads/candidates/${req.params.id}/${file.filename}`;
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "Invalid document field" });
    }

    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.status(200).json({
      documents: updated.documents,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   REMOVE SINGLE DOCUMENT
   ========================================================= */
export const removeDocument = async (req, res, next) => {
  try {
    const { id, field } = req.params;

    if (!["photo", "aadharFront", "aadharBack"].includes(field)) {
      return res.status(400).json({ message: "Invalid document field" });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const filePath = candidate.documents[field];

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(path.resolve(filePath));
    }

    candidate.documents[field] = null;
    await candidate.save();

    res.status(200).json({
      documents: candidate.documents,
    });
  } catch (err) {
    next(err);
  }
};
