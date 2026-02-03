import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import Candidate from "./models/Candidate.js";

dotenv.config();

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Candidate.deleteMany({});

    // Create admin
    const adminPassword = await bcrypt.hash("password123", 10);
    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: adminPassword,
    });

    // Sample candidates
    const candidates = [
      {
        fullName: "Asha Perera",
        dob: new Date("1994-05-12"),
        gender: "Female",
        maritalStatus: "Single",
        email: "asha.perera@example.com",
        mobile: "0712345678",
        correspondenceAddress: "12 Ocean Road, Colombo",
        permanentAddress: "12 Ocean Road, Colombo",
        status: "NEW",
        documents: {
          photo: "https://i.pravatar.cc/150?u=asha",
        },
        familyDetails: [
          { name: "Nimal Perera", relation: "Father", age: 58, occupation: "Farmer" },
        ],
        education: [
          { degree: "BSc Computer Science", institution: "University of Colombo", year: "2016", grade: "Second Upper" },
        ],
        experience: [
          { company: "BlueTech", role: "Junior Developer", startDate: new Date("2017-08-01"), endDate: new Date("2019-06-30") },
        ],
      },

      {
        fullName: "Kamal Fernando",
        dob: new Date("1990-11-20"),
        gender: "Male",
        maritalStatus: "Married",
        email: "kamal.fernando@example.com",
        mobile: "0779876543",
        correspondenceAddress: "45 Temple St, Kandy",
        permanentAddress: "45 Temple St, Kandy",
        status: "REVIEWING",
        documents: {
          photo: "https://i.pravatar.cc/150?u=kamal",
        },
        education: [
          { degree: "HND Mechanical Engineering", institution: "Kandy Technical College", year: "2012", grade: "Pass" },
        ],
        experience: [
          { company: "MechWorks", role: "Technician", startDate: new Date("2013-01-01"), endDate: new Date("2018-12-31") },
          { company: "AutoParts", role: "Supervisor", startDate: new Date("2019-01-01"), endDate: null },
        ],
      },

      {
        fullName: "Nisha Kumari",
        dob: new Date("1996-03-02"),
        gender: "Female",
        maritalStatus: "Single",
        email: "nisha.kumari@example.com",
        mobile: "0751122334",
        correspondenceAddress: "90 Lake View, Galle",
        permanentAddress: "90 Lake View, Galle",
        status: "SHORTLISTED",
        documents: {
          photo: "https://i.pravatar.cc/150?u=nisha",
        },
        education: [
          { degree: "Diploma in HR", institution: "Galle Institute", year: "2017", grade: "Distinction" },
        ],
        experience: [],
      },

      {
        fullName: "Pradeep Silva",
        dob: new Date("1988-07-28"),
        gender: "Male",
        maritalStatus: "Married",
        email: "pradeep.silva@example.com",
        mobile: "0764455667",
        correspondenceAddress: "5 Hill Rd, Negombo",
        permanentAddress: "5 Hill Rd, Negombo",
        status: "REJECTED",
        documents: {
          photo: "https://i.pravatar.cc/150?u=pradeep",
        },
        education: [
          { degree: "BCom", institution: "University of Kelaniya", year: "2010", grade: "Second Class" },
        ],
        experience: [
          { company: "RetailCorp", role: "Store Manager", startDate: new Date("2011-05-01"), endDate: new Date("2016-10-01") },
        ],
      },

      {
        fullName: "Samanthi Jayawardena",
        dob: new Date("1992-09-15"),
        gender: "Female",
        maritalStatus: "Single",
        email: "samanthi.j@example.com",
        mobile: "0709988776",
        correspondenceAddress: "22 Garden Ln, Matara",
        permanentAddress: "22 Garden Ln, Matara",
        status: "HIRED",
        documents: {
          photo: "https://i.pravatar.cc/150?u=samanthi",
        },
        education: [
          { degree: "BA English", institution: "University of Peradeniya", year: "2014", grade: "Second Upper" },
        ],
        experience: [
          { company: "MediaHouse", role: "Content Writer", startDate: new Date("2015-02-01"), endDate: new Date("2020-08-01") },
        ],
      },
    ];

    const created = await Candidate.insertMany(candidates);

    console.log("Seeding complete:");
    console.log(`- Admin created: ${admin.email}`);
    console.log(`- Candidates created: ${created.length}`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
