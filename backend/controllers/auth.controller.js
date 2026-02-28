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
    console.log("log in try started");
    const { role } = req.body;
    let user;

    if (role === "tenant") {
      const { unitCode } = req.body;

      user = await Unit.findOne({ unitCode })
        .select(
          "unitCode unitLabel propertyName unitNumber adminCode role propertyId"
        )
        .lean();

      if (!user) return res.status(401).json({ message: "Invalid Unit Code" });
    }

    if (role === "admin") {
      const { email, pin } = req.body;

      user = await Admin.findOne({ email, pin })
        .select("name adminCode email properties role") // exclude subscription & pin
        .lean();

      if (!user)
        return res.status(401).json({ message: "Invalid email or PIN" });
    }

    // 🔐 TOKEN
    const token = jwt.sign(
      { id: user._id, role, adminCode: user.adminCode },
      process.env.JWT_SECRET || "supersecret_key",
      { expiresIn: "1d" }
    );

    // 🎯 BUILD RESPONSE BASED ON ROLE
    let userData;

    if (role === "tenant") {
      userData = {
        unitId: user._id,
        unitCode: user.unitCode,
        unitLabel: user.unitLabel,
        propertyId: user.propertyId,
        propertyName: user.propertyName,
        adminCode: user.adminCode,
        role: user.role,
      };
    }

    if (role === "admin") {
      userData = {
        adminId: user._id,
        name: user.name,
        adminCode: user.adminCode,
        email: user.email,
        properties: user.properties.map((p) => ({
          id: p._id,
          propertyName: p.propertyName,
          totalUnits: p.totalUnits,
        })),
        role: user.role,
      };
    }
    console.log("user data returned", userData);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
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

        const unitCode = generateUnitCode(
          property.propertyName,
          propertyId,
          unitNumber
        );

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
