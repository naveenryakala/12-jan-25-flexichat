// src/models/client.model.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  systemPrompt: {
    type: String,
    default: "You are a helpful customer support chatbot.",
  },
  channel: { type: String, default: "web" },

  // Block / unblock
  isActive: { type: Boolean, default: true },

  // Soft delete
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 🔹 Auto-update updatedAt before save
// ✅ DO NOT use async if you call next()
clientSchema.pre("save", function () {
  this.updatedAt = Date.now();
  // no next() needed for synchronous hook
});

export default mongoose.model("Client", clientSchema);
