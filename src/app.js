import express from "express";
import { getLLMResponse } from "./services/llm.service.js";
import clientRoutes from "./routes/client.routes.js";
import Conversation from "./models/conversation.model.js";
import Client from "./models/client.model.js";
import conversationRoutes from "./routes/conversation.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
app.use(express.json());

// -----------------------
// Health Check
// -----------------------
app.get("/", (req, res) => {
  res.send("FlexiChat API is running 🚀");
});

// -----------------------
// Multi-Client Chat Endpoint
// -----------------------
app.post("/api/chat", async (req, res) => {
  const { message, clientId } = req.body;

  if (!message || !clientId) {
    return res.status(400).json({
      error: "Message and clientId are required",
    });
  }

  try {
    // 1️⃣ Fetch client (exclude deleted)
    const client = await Client.findOne({ _id: clientId, isDeleted: false });

    if (!client) {
      return res.status(404).json({
        error: "Client not found or deleted",
      });
    }

    // 🚫 Blocked client cannot chat
    if (!client.isActive) {
      return res.status(403).json({
        error: "This client is blocked. Chat access disabled.",
      });
    }

    // 2️⃣ Fetch last 5 messages for context
    let previousMessages = await Conversation.find({ clientId })
      .sort({ createdAt: -1 })
      .limit(5);
    previousMessages = previousMessages.reverse();

    const context = previousMessages
      .map(msg => `User: ${msg.userMessage}\nBot: ${msg.botReply}`)
      .join("\n");

    // 3️⃣ Combine system prompt + context
    const systemPrompt = `${client.systemPrompt}\nContext:\n${context}`;

    // 4️⃣ Send message to LLM
    const botReply = await getLLMResponse(message, systemPrompt);

    // 5️⃣ Save conversation
    await Conversation.create({ clientId, userMessage: message, botReply });

    // 6️⃣ Respond
    res.json({
      success: true,
      client: client.name,
      userMessage: message,
      botReply,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// -----------------------
// Register Client Routes
// -----------------------
app.use("/api/clients", clientRoutes);

// -----------------------
// Register Conversation Routes
// -----------------------
app.use("/api/conversations", conversationRoutes);

// -----------------------
// Register Admin Routes
// -----------------------
app.use("/api/admin", adminRoutes);

export default app;
