import mongoose from "mongoose";

/* =========================
   SUB SCHEMAS
========================= */

const FamilySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    age: { type: Number },
    occupation: { type: String, trim: true },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    year: { type: String, trim: true },
    grade: { type: String, trim: true },
  },
  { _id: false }
);

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false }
);

/* =========================
   MAIN CANDIDATE SCHEMA
========================= */

const CandidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    dob: { type: Date },

    gender: {
      type: String,
      trim: true,
    },

    maritalStatus: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },

    mobile: {
      type: String,
      trim: true,
      index: true,
    },

    correspondenceAddress: {
      type: String,
      trim: true,
    },

    permanentAddress: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["NEW", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"],
      default: "NEW",
      index: true,
    },

    familyDetails: {
      type: [FamilySchema],
      default: [],
    },

    education: {
      type: [EducationSchema],
      default: [],
    },

    experience: {
      type: [ExperienceSchema],
      default: [],
    },

    documents: {
      photo: {
        type: String, // e.g. uploads/candidates/{id}/photo.jpg
        default: null,
      },
      aadharFront: {
        type: String,
        default: null,
      },
      aadharBack: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* =========================
   MODEL EXPORT
========================= */

const Candidate = mongoose.model("Candidate", CandidateSchema);
export default Candidate;
