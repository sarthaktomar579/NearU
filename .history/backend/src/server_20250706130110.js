import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";

const app = express();

const vercelBase = ".vercel.app";

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin || // allow mobile apps or tools like curl
        origin === process.env.FRONTEND_URL || // exact match (main prod)
        origin === "http://localhost:5173" || // dev
        origin.endsWith(vercelBase) // wildcard for Vercel preview domains
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("NearU backend is live!");
});

// DB connection
connectDB();

export default app;
