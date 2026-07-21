import express from "express";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Protect all task routes
router.use(protect);

// CRUD Routes
router.route("/")
    .get(getTasks)
    .post(createTask);

router.route("/:id")
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

export default router;