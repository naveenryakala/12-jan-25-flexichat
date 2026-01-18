import Client from "../models/client.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ClientSession from "../models/clientSession.model.js";
import dotenv from "dotenv";
dotenv.config();

/* =========================
   CLIENT LOGIN
========================= */
export const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check client exists
    const client = await Client.findOne({ email }).select("+password");
    if (!client || client.isDeleted || !client.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      { id: client._id, role: client.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Create session
    await ClientSession.create({
      clientId: client._id,
      token,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        systemPrompt: client.systemPrompt,
        channel: client.channel,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   CLIENT LOGOUT
========================= */
export const clientLogout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    await ClientSession.findOneAndUpdate(
      { token, isActive: true },
      {
        isActive: false,
        loggedOutAt: new Date(),
      }
    );

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Logout failed" });
  }
};
