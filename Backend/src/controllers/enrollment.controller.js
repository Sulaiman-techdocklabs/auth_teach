import Enrollment from "../models/enrollment.model.js";
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";

export const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student")
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

export const createEnrollment = async (req, res, next) => {
  try {
    const { student, course } = req.body;

    const studentExists = await Student.findById(student);

    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const courseExists = await Course.findById(course);

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student,
      course,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course.",
      });
    }

    const enrollment = await Enrollment.create({
      student,
      course,
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("student")
      .populate("course");

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully.",
      data: populatedEnrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    await enrollment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};