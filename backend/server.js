const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
//const { json } = require("stream/consumers");

const app = new express();

app.use(cors());
app.use(express.json());

const getLogin = (req, res) => {
  if (req.query.role === "TENANT") {
    //To debug
    console.log("LOGIN HIT:", req.query);

    const tenantsPath = path.join(
      __dirname,
      "..",
      "frontend/data",
      "tenants.json"
    );
    const data = fs.readFileSync(tenantsPath, "utf-8");

    const tenants = JSON.parse(data);
    const tenantExists = tenants.find(
      (tenant) => tenant.tenantId === req.query.tenantCode
    );
    if (!tenantExists) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "User exists" });
    }
  } else if (req.query.role === "OWNER") {
    const ownersPath = path.join(
      __dirname,
      "..",
      "frontend/data",
      "owners.json"
    );
    console.log(ownersPath);
    const data = fs.readFileSync(ownersPath, "utf-8");
    const owners = JSON.parse(data);
    const ownerExists = owners.find((owner) => owner.phone === req.query.phone);
    if (!ownerExists) {
      return res.status(404).json({ message: "user not found" });
    } else {
      return res.status(200).json({ message: "user exist" });
    }
  } else {
    return res.status(404).json({ message: "Invalid role" });
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
    const { name, email, phone, property} = req.body;
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

app.get("/api/login", getLogin);

app.put("/api/report/:id", updateReportStatus);

app.post("/api/report", logAreport);
app.post("/api/admin", createNewAdminUser);

app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
});

//OBD17302012026
