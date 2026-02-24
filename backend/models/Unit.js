import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    unitCode: { type: String, required: true, unique: true },
    adminCode: { type: String, required: true },
    propertyId: { type: String, required: true },
    propertyName: { type: String, required: true },
    unitNumber: { type: String, required: true },
    unitLabel: { type: String, required: true },
    active: { type: Boolean, default: true },
    role: { type: String, default: "tenant" },
  }
);

unitSchema.index({ adminCode: 1 });
unitSchema.index({ propertyId: 1 });

const Unit = mongoose.model("Unit", unitSchema);
export default Unit;
