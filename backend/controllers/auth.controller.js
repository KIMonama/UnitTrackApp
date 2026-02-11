import fs from "fs";
import { adminsFile } from "../config/path.js";
import { unitsFile } from "../config/path.js";

import Admin from "../models/Admin.js";
import Unit from "../models/Unit.js";

export const login = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // ===============================
    // TENANT LOGIN (UNIT-BASED)
    // ===============================
    if (role === "tenant") {
      const { unitCode } = req.body;
      let query = {};
      if (!unitCode) {
        return res.status(400).json({ message: "Unit code is required" });
      } else {
        query.unitCode = unitCode;
      }
      const unitExists = await Unit.find(query);

      return res.status(200).json({
        message: "Login successful",
        user: unitExists,
      });
    }

    // ===============================
    // ADMIN LOGIN
    // ===============================
    if (role === "admin") {
      const { email, pin } = req.body;
      let query = {};

      if (!email || !pin) {
        return res
          .status(400)
          .json({ message: "Admin credentials is required" });
      } else {
        query.email = email;
        query.pin = pin;
      }

      const adminExists = admins.find(
        (admin) =>
          admin.email === email && admin.pin === pin && admin.active === true
      );

      if (!adminExists) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: adminExists,
      });
    }

    // ===============================
    // INVALID ROLE
    // ===============================
    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, property, pin } = req.body;
    const unitCount = Number(req.body.unitCount);

    // 1. Better AdminCode generation for MongoDB
    const count = await Admin.countDocuments();
    const adminCode = String(count + 1).padStart(3, "0");

    // 2. Create the Admin Instance
    const newAdmin = new Admin({
      adminCode,
      name,
      email,
      phone,
      // Mapping your 'property' string to our Schema's 'properties' array
      properties: [{ propertyName: property, unitCount }],
      pin, // Don't forget the pin for login!
      active: true,
    });

    const savedAdmin = await newAdmin.save(); // ✅ Fixed: Save the instance

    // 3. Auto-generate units
    const unitPromises = [];
    for (let i = 1; i <= unitCount; i++) {
      const unitNumber = String(i).padStart(2, "0");

      const newUnit = new Unit({
        unitCode: `${adminCode}${unitNumber}`,
        adminCode,
        unitNumber,
        unitLabel: `Room ${i}`,
        active: true,
      });

      unitPromises.push(newUnit.save());
    }

    // This makes the unit creation run in parallel (faster!)
    await Promise.all(unitPromises);

    return res.status(201).json({
      message: "Admin and units created successfully",
      adminCode: savedAdmin.adminCode,
      unitsCreated: unitCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
};
