import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },

  adminCode: { type: String, required: true },
  propertyId: { type: String, required: true },
  propertyName: { type: String, required: true },
  unitCode: { type: String, required: true },
  unitLabel: { type: String, required: true },
  category: { type: String },
  description: { type: String, required: true },
  urgency: {
    type: String,
    enum: ["low", "medium", "high", "emergency", undefined], // Add undefined to enum
    default: function () {
      // If this is a maintenance report, use 'low'. Otherwise, don't set it.
      return this.role === "maintenance" ? "low" : undefined;
    },
  },

  status: {
    type: String,
    enum: ["NEW", "Seen", "Done", undefined],
    default: function () {
      // Suggestions might not need a status, or you can keep it 'NEW'
      return this.role === "maintenance" ? "NEW" : undefined;
    },
  },
  dateAvailable: { type: String }, // Storing as string per your example
  dateSubmitted: { type: String }, // Storing as string per your example
  role: { type: String, required: true },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
