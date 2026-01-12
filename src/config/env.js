import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};

// Fail fast if critical env is missing
if (!env.mongoUri) {
  console.error("❌ MONGO_URI is missing in environment variables");
  process.exit(1);
}

export default env;
