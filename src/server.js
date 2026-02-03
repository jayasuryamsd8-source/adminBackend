import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    server.on("error", (err) => {
      if (err && err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. ` +
          `Kill the process using the port or set a different PORT environment variable.`);
        console.error("Commands (Windows PowerShell):");
        console.error("  netstat -ano | Select-String \":5000\"");
        console.error("  Stop-Process -Id <PID> -Force");
        process.exit(1);
      }

      console.error("Server error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
}

startServer();
