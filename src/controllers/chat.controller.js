import { getLLMResponse } from "../services/llm.service.js";

export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Valid message is required"
      });
    }

    const botReply = await getLLMResponse(message);

    res.status(200).json({
      success: true,
      userMessage: message,
      botReply
    });
  } catch (error) {
    console.error("❌ Chat Controller Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
