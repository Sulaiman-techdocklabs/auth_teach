import Task from "../models/task.model.js";

/**
 * Create Task
 */
export const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Title and Due Date are required."
            });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            user: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully.",
            data: task
        });

    } catch (err) {
        next(err);
    }
};

/**
 * Get All Tasks
 */
export const getTasks = async (req, res, next) => {
    try {

        const tasks = await Task.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (err) {
        next(err);
    }
};

/**
 * Get Single Task
 */
export const getTaskById = async (req, res, next) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        return res.json({
            success: true,
            data: task
        });

    } catch (err) {
        next(err);
    }
};

/**
 * Update Task
 */
export const updateTask = async (req, res, next) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        const {
            title,
            description,
            priority,
            status,
            dueDate
        } = req.body;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;
        if (dueDate !== undefined) task.dueDate = dueDate;

        await task.save();

        return res.json({
            success: true,
            message: "Task updated successfully.",
            data: task
        });

    } catch (err) {
        next(err);
    }
};

/**
 * Delete Task
 */
export const deleteTask = async (req, res, next) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }

        await task.deleteOne();

        return res.json({
            success: true,
            message: "Task deleted successfully."
        });

    } catch (err) {
        next(err);
    }
};