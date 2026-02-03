import multer from "multer";
import path from "path";
import fs from "fs";

/* =========================================================
   FILE FILTER (IMAGES ONLY)
   ========================================================= */
function fileFilter(_req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG images are allowed"), false);
  }
}

/* =========================================================
   STORAGE CONFIG (PER CANDIDATE)
   uploads/candidates/{candidateId}/
   ========================================================= */
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const candidateId = req.params.id;

    if (!candidateId) {
      return cb(new Error("Candidate ID missing in upload request"));
    }

    const dir = path.join(
      process.cwd(),
      "uploads",
      "candidates",
      candidateId
    );

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.fieldname;
    const unique = `${safeName}-${Date.now()}${ext}`;

    cb(null, unique);
  },
});

/* =========================================================
   MULTER INSTANCE
   ========================================================= */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default upload;
