import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();

const __dirname = path.resolve();

// High performance response compression (Gzip/Brotli)
// Reduces response payload sizes by up to 80% for large user lists
app.use(
  compression({
    level: 6,
    threshold: 1024, // Only compress responses > 1KB
  })
);

const allowedOrigins = [
  "https://near-u-frontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Protect database from connection thrashing with pooled connection handler
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    res.status(503).json({ message: "Database connection failed" });
  }
});

// Parse request bodies with reasonable size limits to prevent payload memory exhaustion
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate Limiting for high scale protection
// 1. Strict rate limiter for auth (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per 15 min per IP
  message: { message: "Too many authentication attempts, please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. General API rate limiter for standard routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600, // 600 requests per 15 min per IP
  message: { message: "Too many requests, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("API is live on Vercel 🎉");
});

app.get("/api/migrate-avatars", async (req, res) => {
  try {
    const User = (await import("./models/User.js")).default;
    const users = await User.find({
      $or: [
        { profilePic: { $regex: "avatar.iran.liara.run" } },
        { profilePic: "" },
        { profilePic: { $exists: false } },
      ],
    })
      .select("_id email")
      .limit(500)
      .lean();

    let count = 0;
    const bulkOps = users.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          profilePic: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
        },
      },
    }));

    if (bulkOps.length > 0) {
      const result = await User.bulkWrite(bulkOps);
      count = result.modifiedCount;
    }

    res.json({ success: true, message: `Updated ${count} user(s) avatars` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Optional: Serve frontend build if deployed together
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Instead of app.listen, just export app for serverless / start in dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
