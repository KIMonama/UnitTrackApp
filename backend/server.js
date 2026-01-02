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
app.post("/api/report", logAreport);
app.put("/api/report/:id", updateReportStatus);

app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
});

//OBD17302012026
