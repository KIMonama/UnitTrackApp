import fs from "fs";
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;

export const logAreport = (req, res) => {
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

export const updateReportStatus = (req, res) => {
  console.log("PARAM ID:", req.params.id);
  console.log("BODY:", req.body);

  try {
    const reportId = req.params.id;
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
    return res.status(200).json({ message: "Report status updated" });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating report status",
      error: error.message,
    });
  }
};

export const getAllReports = (req, res) => {
  try {
    const { adminCode, status } = req.query;
    console.log("QUERY PARAMS:", req.query);

    const reportsPath = path.join(
      __dirname,
      "..",
      "frontend/data",
      "reports.json"
    );

    const data = fs.readFileSync(reportsPath, "utf-8");
    let reports = JSON.parse(data);

    // ✅ FILTER BY adminCode IF PROVIDED
    if (adminCode) {
      reports = reports.filter((report) => report.adminCode === adminCode);
    }

    // ✅ FILTER BY status IF PROVIDED
    if (status) {
      reports = reports.filter((report) => report.status === status);
    }

    return res.status(200).json({
      message: "Reports retrieved successfully",
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving reports",
      error: error.message,
    });
  }
};
