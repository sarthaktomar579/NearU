import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();

const __dirname = path.resolve();

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

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection failed:", error.message);
    res.status(503).json({ message: "Database connection failed" });
  }
});

app.use(express.json());
app.use(cookieParser());

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
    });
    let count = 0;
    for (const user of users) {
      await User.updateOne(
        { _id: user._id },
        { profilePic: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.email)}` }
      );
      count++;
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

// ✅ Instead of app.listen, just export app
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
