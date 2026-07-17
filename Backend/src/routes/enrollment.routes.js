import express from "express";
import {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
} from "../controllers/enrollment.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getEnrollments);

router.post("/", createEnrollment);

router.delete("/:id", deleteEnrollment);

export default router;