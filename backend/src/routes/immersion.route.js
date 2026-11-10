import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getDailyImmersion,
  getRandomImmersion,
} from "../controllers/immersion.controller.js";

const router = express.Router();

// Apply auth middleware
router.use(protectRoute);

router.get("/daily", getDailyImmersion);
router.get("/random", getRandomImmersion);

export default router;
