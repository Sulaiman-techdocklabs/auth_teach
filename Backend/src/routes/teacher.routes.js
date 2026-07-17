import express from "express";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getTeachers);

router.post("/", createTeacher);

router.put("/:id", updateTeacher);

router.delete("/:id", deleteTeacher);

export default router;