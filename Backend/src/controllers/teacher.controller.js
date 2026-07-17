import Teacher from "../models/teacher.model.js";

export const getTeachers = async (req, res, next) => {
  try {
    const { search } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const teachers = await Teacher.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
};

export const createTeacher = async (req, res, next) => {
  try {
    const { name, employeeId, email, department } = req.body;

    const existingTeacher = await Teacher.findOne({
      $or: [{ employeeId }, { email }],
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists.",
      });
    }

    const teacher = await Teacher.create({
      name,
      employeeId,
      email,
      department,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully.",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully.",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    await teacher.deleteOne();

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};