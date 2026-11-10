import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { invalidateUserCache } from "../middleware/auth.middleware.js";

// Helper to sanitize user object and ensure password is removed
function sanitizeUser(user) {
  if (!user) return null;
  const userObj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete userObj.password;
  userObj.id = userObj._id.toString();
  return userObj;
}

// Util to send JWT cookie
function sendToken(res, token) {
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "None", // required for cross-origin cookies
    secure: true,     // required when using SameSite=None
  });
}

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail }).select("_id").lean();
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a different one" });
    }

    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`;

    const newUser = await User.create({
      email: normalizedEmail,
      fullName: fullName.trim(),
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`✅ Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("⚠️ Error creating Stream user:", error.message);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    sendToken(res, token);
    res.status(201).json({ success: true, user: sanitizeUser(newUser) });
  } catch (error) {
    console.error("❌ Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    sendToken(res, token);
    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error("❌ Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  if (req.user && req.user._id) {
    invalidateUserCache(req.user._id);
  }
  res.clearCookie("jwt", {
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id || req.user.id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName.trim(),
        bio: bio.trim(),
        nativeLanguage: nativeLanguage.trim(),
        learningLanguage: learningLanguage.trim(),
        location: location.trim(),
        isOnboarded: true,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    // Invalidate session cache
    invalidateUserCache(userId);

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`✅ Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("⚠️ Error updating Stream user:", streamError.message);
    }

    res.status(200).json({ success: true, user: sanitizeUser(updatedUser) });
  } catch (error) {
    console.error("❌ Onboarding error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
