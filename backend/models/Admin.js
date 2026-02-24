import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyName: String,
    totalUnits: Number,
  },
  { _id: false }
);

export const adminSchema = new mongoose.Schema(
  {
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
    properties: [propertySchema],
    subscription: {
      tier: {
        type: String,
        enum: ["Freemium", "Starter", "Elite", "Portfolio"],
        required: true,
      },
      active: { type: Boolean, default: true },
      startedAt: { type: Date, default: Date.now },
    },
    active: { type: Boolean, default: true },
    role: { type: String, default: "admin" },
    pin: { type: String, required: true }, // Industry standard: will be hashed later
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
