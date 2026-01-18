import express from "express";
import Client from "../models/client.model.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  createClient,
  getClientProfile,
} from "../controllers/client.controller.js";
import {
  clientLogin,
  clientLogout,
} from "../controllers/auth.controller.js";

const router = express.Router();

/* =========================
   CLIENT AUTH (PUBLIC)
========================= */
router.post("/login", clientLogin);

/* =========================
   CLIENT (LOGGED-IN)
========================= */
router.get("/me", protect, authorizeRoles("CLIENT"), getClientProfile);
router.post("/logout", protect, authorizeRoles("CLIENT"), clientLogout);

/* =========================
   ADMIN ONLY
========================= */
router.use(protect, authorizeRoles("ADMIN"));

router.post("/", createClient);

router.get("/", async (req, res) => {
  const clients = await Client.find({ isDeleted: false });
  res.json({ clients });
});

export default router;
