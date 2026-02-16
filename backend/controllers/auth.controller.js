import Admin from "../models/Admin.js";
import Unit from "../models/Unit.js";

import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { role } = req.body;
    let user;

    if (role === "tenant") {
      const { unitCode } = req.body;
      user = await Unit.findOne({ unitCode });
      if (!user) return res.status(401).json({ message: "Invalid Unit Code" });
    } else if (role === "admin") {
      const { email, pin } = req.body;
      user = await Admin.findOne({ email, pin });
      if (!user)
        return res.status(401).json({ message: "Invalid email or PIN" });
    }

    // 1. GENERATE THE TOKEN
    // We store the ID and Role inside the token so the middleware can read it later.
    const token = jwt.sign(
      { id: user._id, adminCode: user.adminCode },
      process.env.JWT_SECRET || "supersecret_key",
      { expiresIn: "1d" } // Token lasts for 24 hours
    );

    // 2. SEND TOKEN BACK TO FRONTEND
    // Define the user data structure based on the role
    let userData = {
      id: user._id,
      role: user.role,
      adminCode: user.adminCode, // Common to both as a reference
    };

    if (role === "tenant") {
      // Fields specifically for the Tenant (Unit)
      userData.unitLabel = user.unitLabel;
    } else {
      // Fields specifically for the Admin
      userData.name = user.name;
      userData.properties = user.properties;
    }

    // Send the response
    return res.status(200).json({
      message: "Login successful",
      token,
      role: role,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
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
