const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
//const { json } = require("stream/consumers");

const app = new express();

app.use(cors());
app.use(express.json());

const login = (req, res) => {
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

const logAreport = (req, res) => {
  const reportsPath = path.join(
    __dirname,
    "..",
    "frontend/data",
    "reports.json"
  );
  const data = fs.readFileSync(reportsPath, "utf-8");

  const reports = JSON.parse(data);
  const newReport = req.body;
  reports.push(newReport);

  // ✅ WRITE BACK TO FILE (this was missing)
  fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));

  // ✅ RESPONSE
  return res
    .status(200)
    .json({ message: "New report was recreated successfully" });
};

const createNewAdminUser = (req, res) => {
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

const updateReportStatus = (req, res) => {
  console.log("PARAM ID:", req.params.id);
  console.log("BODY:", req.body);

  try {
    const reportId = Number(req.params.id);
    const { status } = req.body;

    const reportsPath = path.join(
      __dirname,
      "..",
      "frontend/data",
      "reports.json"
    );

    // Read file
    const data = fs.readFileSync(reportsPath, "utf-8");

    const reports = JSON.parse(data);

    let reportFound = false;

    // Update status
    reports.forEach((report) => {
      if (report.reportId === reportId) {
        report.status = status;
        reportFound = true;
      }
    });
    if (!reportFound) {
      return res.status(404).json({ message: "Report not found" });
    }

    // ✅ WRITE BACK TO FILE (this was missing)
    fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));

    // ✅ RESPONSE
    return res
      .status(200)
      .json({ message: "New report was recreated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating report status",
      error: error.message,
    });
  }
};

const getAllReports = (req, res) => {
  try {
    const { adminCode } = req.params;
    console.log("ADMIN CODE FROM URL:", adminCode);

    const reportsPath = path.join(
      __dirname,
      "..",
      "frontend/data",
      "reports.json"
    );

    // Read file
    const data = fs.readFileSync(reportsPath, "utf-8");

    const reports = JSON.parse(data);

    //container for the specific admin data
    const container = [];

    // Update status
    reports.forEach((report) => {
      if (report.adminCode === adminCode) {
        container.push(report);
      }
    });

    // ✅ RESPONSE
    return res.status(200).json({
      message: "New report was recreated successfully",
      reports: container,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving reports",
      error: error.message,
    });
  }
};

app.post("/api/auth/login", login);

app.put("/api/report/:id", updateReportStatus);

app.post("/api/report", logAreport);
app.post("/api/admin", createNewAdminUser);

app.get("/api/reports/:adminCode", getAllReports);

app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
});
