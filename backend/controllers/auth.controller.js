import Admin from "../models/Admin.js";
import Unit from "../models/Unit.js";

import jwt from "jsonwebtoken";
import {
  generateAdminCode,
  generatePropertyId,
  generateUnitCode,
} from "../utils/codeGenerators.js";

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
    console.log("registerbackend");
    const { name, email, phone, properties, pin, subscription } = req.body;

    const adminCode = generateAdminCode();

    // 1️⃣ Map properties into Admin schema format
    const mappedProperties = properties.map((p) => ({
      propertyName: p.name.trim(),
      totalUnits: p.units,
    }));

    // 2️⃣ Create Admin
    const newAdmin = new Admin({
      adminCode,
      name,
      email,
      phone,
      properties: mappedProperties,
      subscription: {
        tier: subscription.name, // must match enum
        active: true,
      },
      pin,
      active: true,
    });

    const savedAdmin = await newAdmin.save();

    // 3️⃣ Generate Units per Property
    const unitPromises = [];

    for (const property of mappedProperties) {
      const propertyId = generatePropertyId();

      for (let i = 1; i <= property.totalUnits; i++) {
        const unitNumber = String(i).padStart(2, "0");

        const unitCode = generateUnitCode(property.propertyName, unitNumber);

        const newUnit = new Unit({
          unitCode,
          adminCode,
          propertyId,
          propertyName: property.propertyName,
          unitNumber,
          unitLabel: `Unit ${i}`,
          active: true,
        });

        unitPromises.push(newUnit.save());
      }
    }

    await Promise.all(unitPromises);

    return res.status(201).json({
      message: "Admin and units created successfully",
      adminCode: savedAdmin.adminCode,
      properties: mappedProperties.length,
      unitsCreated: unitPromises.length,
    });
  } catch (error) {
    console.error("REGISTER ERROR FULL:", error);
    return res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
};
