import jwt from "jsonwebtoken";
import ClientSession from "../models/clientSession.model.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ SESSION CHECK → ONLY FOR CLIENT
    if (decoded.role === "CLIENT") {
      const session = await ClientSession.findOne({
        token,
        isActive: true,
      });

      if (!session) {
        return res
          .status(401)
          .json({ error: "Session expired. Please login again." });
      }

      req.session = session;
    }

    // 4️⃣ Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
};
