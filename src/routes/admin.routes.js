import express from "express";
import Admin from "../models/admin.model.js";
import { generateToken } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// ----------------------
// Register admin (run once)
// ----------------------
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        error: "Admin already exists. Please login.",
      });
    }

    await Admin.create({ email, password });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error("Admin register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// Login admin
// ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Include role in token
    const token = generateToken({ adminId: admin._id, role: "admin", email });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// Protected admin route
// ----------------------
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("admin"), // Only admin can access
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      admin: req.user,
    });
  }
);

export default router;
