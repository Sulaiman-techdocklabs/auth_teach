import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    punchIn: {
      type: Date,
      required: true,
    },

    punchOut: {
      type: Date,
      default: null,
    },

    totalHours: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Full Day", "Half Day", "Absent"],
      default: "Absent",
    },
  },
  {
    timestamps: true,
  }
);
attendanceSchema.index(
  { user: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);