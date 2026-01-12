import axios from "axios";

/**
 * Sends a message to the LLM and returns the bot reply.
 * @param {string} userMessage - Message from the user
 * @param {string} systemPrompt - Custom system prompt per client
 * @returns {string} bot reply
 */
export const getLLMResponse = async (userMessage, systemPrompt) => {
  try {
    console.log("🧠 Sending request to Groq...");
    console.log("🔑 API Key Loaded:", process.env.LLM_API_KEY ? "YES" : "NO");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // Use current supported model
        messages: [
          {
            role: "system",
            content: systemPrompt || "You are a helpful customer support chatbot."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("❌ Groq API ERROR:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }

    return "Sorry, the AI service is temporarily unavailable.";
  }
};
