import express from "express";
import Client from "../models/client.model.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(adminAuth);

// -----------------------
// Create client
// -----------------------
router.post("/", async (req, res) => {
  try {
    const { name, systemPrompt, channel } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Client name is required" });
    }

    const client = await Client.create({
      name,
      systemPrompt,
      channel,
      isActive: true,
      isDeleted: false,
    });

    res.status(201).json({ success: true, client });
  } catch (error) {
    console.error("Create client error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------
// Get all clients (exclude deleted)
// -----------------------
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find({ isDeleted: false });
    res.json({ success: true, clients });
  } catch (error) {
    console.error("Get clients error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------
// Get single client
// -----------------------
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ success: true, client });
  } catch (error) {
    console.error("Get client error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------
// Update client
// -----------------------
router.put("/:id", async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ success: true, client });
  } catch (error) {
    console.error("Update client error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------
// Block client
// -----------------------
router.patch("/:id/block", async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isActive: false },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({
      success: true,
      message: "Client blocked successfully",
      client,
    });
  } catch (error) {
    console.error("Block client error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------
// Unblock client
// -----------------------
router.patch("/:id/unblock", async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isActive: true },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({
      success: true,
      message: "Client unblocked successfully",
      client,
    });
  } catch (error) {
    console.error("Unblock client error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------
// Soft delete client
// -----------------------
router.delete("/:id", async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete client error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
