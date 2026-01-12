// 🔥 Load env FIRST (before anything else)
import "./config/env.js";

import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

// Connect DB once
await connectDB();

// Start server
const PORT = env.port || 5000;

// Start server
app.listen(env.port, () => {
  console.log(`🚀 Server running on port ${env.port}`);
  console.log(`🌱 Environment: ${env.nodeEnv}`);
});
