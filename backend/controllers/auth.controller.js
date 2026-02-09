import fs from "fs";
import path from "path";
import { adminsFile } from "../config/path.js";
import { unitsFile } from "../config/path.js";


export const login = (req, res) => {
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

      if (!unitCode) {
        return res.status(400).json({ message: "Unit code is required" });
      }

      const units = JSON.parse(fs.readFileSync(unitsFile, "utf-8"));

      const unitExists = units.find(
        (unit) => unit.unitCode === unitCode && unit.active === true
      );

      if (!unitExists) {
        return res.status(404).json({ message: "Unit not found" });
      }

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

      if (!email || !pin) {
        return res
          .status(400)
          .json({ message: "Admin credentials is required" });
      }
      const admins = JSON.parse(fs.readFileSync(adminsFile, "utf-8"));

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

export const register = (req, res) => {
  try {
    const { name, email, phone, property, password} = req.body;
    const unitCount = Number(req.body.unitCount);


    //create parse the data from the files into json variables
    const admins = JSON.parse(fs.readFileSync(adminsFile, "utf-8"));
    const units = JSON.parse(fs.readFileSync(unitsFile, "utf-8"));

    //AdminCode generation
    const nextAdminNumber = admins.length + 1;
    const adminCode = String(nextAdminNumber).padStart(3, "0");

    //create a new admin object
    const newAdmin = {
      adminCode,
      name,
      email,
      phone,
      property,
      unitCount,
      password,
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    //ADD the new admin to the admins json array
    admins.push(newAdmin);

    //Autogenerate units based on unitCount
    for (let i = 1; i <= unitCount; i++) {
      const unitNumber = String(i).padStart(2, "0");

      units.push({
        unitCode: `${adminCode}${unitNumber}`,
        adminCode,
        unitNumber,
        unitLabel: `Room ${i}`,
        active: true,
      });
    }
    // ✅ WRITE BACK TO FILE (this was missing)
    fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));
    fs.writeFileSync(unitsFile, JSON.stringify(units, null, 2));

    // ✅ RESPONSE
    return res.status(201).json({
      message: "Admin and units created successfully",
      adminCode,
      unitsCreated: unitCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
};
