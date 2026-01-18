// src/controllers/client.controller.js
import Client from "../models/client.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Admin creates a client
export const createClient = async (req, res) => {
  try {
    const { name, email, password, systemPrompt, channel } = req.body;

    // Check if email already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ error: "Client email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await Client.create({
      name,
      email,
      password: hashedPassword,
      systemPrompt,
      channel,
      role: "CLIENT",
    });

    res.status(201).json({
      message: "Client created successfully",
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        systemPrompt: client.systemPrompt,
        channel: client.channel,
        isActive: client.isActive,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Client gets their profile
export const getClientProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.user.id).select("-password");

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({
      id: client._id,
      name: client.name,
      email: client.email,
      systemPrompt: client.systemPrompt,
      channel: client.channel,
      isActive: client.isActive,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
