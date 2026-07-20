import express from "express";
import {
  getAttendance,
  punchIn,
  punchOut,
} from "../controllers/attendance.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// All attendance routes require authentication
router.use(protect);

// Get attendance history
router.get("/", getAttendance);

// Punch In
router.post("/punch-in", punchIn);

// Punch Out
router.post("/punch-out", punchOut);

export default router;