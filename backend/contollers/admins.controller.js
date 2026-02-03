import fs from "fs";
import path from "path";

export const createNewAdminUser = (req, res) => {
  try {
    const { name, email, phone, property } = req.body;
    const unitCount = Number(req.body.unitCount);

    //Create paths for both the units and admins files
    const adminsPath = path.join(
      __dirname,
      "..",
      "frontend/data",
      "admins.json"
    );
    const unitsPath = path.join(__dirname, "..", "frontend/data", "units.json");

    //create parse the data from the files into json variables
    const admins = JSON.parse(fs.readFileSync(adminsPath, "utf-8"));
    const units = JSON.parse(fs.readFileSync(unitsPath, "utf-8"));

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
    fs.writeFileSync(adminsPath, JSON.stringify(admins, null, 2));
    fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));

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