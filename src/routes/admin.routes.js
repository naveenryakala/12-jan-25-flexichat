// src/routes/admin.routes.js
import express from "express";
import Admin from "../models/admin.model.js";
import { generateToken } from "../utils/jwt.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register admin (run once)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) {
    return res.status(409).json({ error: "Admin already exists" });
  }

  await Admin.create({ email, password });
  res.status(201).json({ message: "Admin registered" });
});

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken({
    id: admin._id,
    role: "ADMIN",
  });

  res.json({ token });
});

// Protected route
router.get(
  "/dashboard",
  protect,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin", user: req.user });
  }
);

export default router;
