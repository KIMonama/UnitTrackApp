import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },

  adminCode: { type: String, required: true },
  unitLabel: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  urgency: {
    type: String,
    enum: ["low", "medium", "high", "emergency"],
    default: "low",
  },

  // Status with your specific range
  status: {
    type: String,
    enum: ["NEW", "seen", "Done"],
    default: "NEW",
  },

  dateAvailable: { type: String }, // Storing as string per your example
  dateSubmitted: { type: String }, // Storing as string per your example
  role: { type: String, default: "maintenance" },
});

const Report = mongoose.model("Report",reportSchema);
export default Report;