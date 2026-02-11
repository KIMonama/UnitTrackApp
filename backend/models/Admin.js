import mongoose, { mongo } from "mongoose";

export const adminSchema = new mongoose.Schema({
  adminCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: { type: String, required: true },

  // Future-proofing: We store properties in an array of objects.
  // For now, you can just treat the first item as your main property.
  properties: [
    {
      propertyName: { type: String, required: true },
      unitCount: { type: Number, default: 0 },
    },
  ],

  active: { type: Boolean, default: true },
  role: { type: String, default: "admin" },
  pin: { type: String, required: true }, // Industry standard: will be hashed later
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
