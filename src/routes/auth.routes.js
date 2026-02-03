import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected route to verify token
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router;