import fs from "fs";
import path from "path";


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

      const unitsPath = path.join(
        __dirname,
        "..",
        "frontend/data",
        "units.json"
      );

      const units = JSON.parse(fs.readFileSync(unitsPath, "utf-8"));

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

      const adminsPath = path.join(
        __dirname,
        "..",
        "frontend/data",
        "admins.json"
      );

      const admins = JSON.parse(fs.readFileSync(adminsPath, "utf-8"));

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
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};