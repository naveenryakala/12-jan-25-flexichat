// src/models/client.model.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false, // 🔒 never return password by default
  },

  role: {
    type: String,
    enum: ["CLIENT"],
    default: "CLIENT",
  },

  // Chatbot config
  systemPrompt: {
    type: String,
    default: "You are a helpful customer support chatbot.",
  },

  channel: {
    type: String,
    default: "web",
  },

  // Block / unblock
  isActive: {
    type: Boolean,
    default: true,
  },

  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false,
  },

  deletedAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔹 Auto-update updatedAt before save
clientSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

export default mongoose.model("Client", clientSchema);
