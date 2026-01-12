import express from "express";
import Conversation from "../models/conversation.model.js";

const router = express.Router();

// Get conversation history for a client
router.get("/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const { limit = 20, page = 1 } = req.query;

  try {
    const conversations = await Conversation.find({ clientId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
