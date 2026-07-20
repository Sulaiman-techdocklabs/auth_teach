import express from "express";
import {
  getLeaves,
  applyLeave,
} from "../controllers/leave.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// All leave routes require authentication
router.use(protect);

// Get Leave History
router.get("/", getLeaves);

// Apply Leave
router.post("/", applyLeave);

export default router;