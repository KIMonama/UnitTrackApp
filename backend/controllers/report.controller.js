import Report from "../models/Report.js";
import jwt from "jsonwebtoken";
import { generateReportId } from "../utils/codeGenerators.js";

export const logAreport = async (req, res) => {
  try {
    console.log("New Report controller hit");

    const {
      propertyId,
      reportId,
      propertyName,
      unitCode,
      unitLabel,
      category,
      description,
      urgency,
      dateAvailable,
      role,
    } = req.body;
console.log(req.body);
    // 🔐 Trust JWT, not frontend
    const adminCode = req.user.adminCode;

    // 🧠 Base report object (schema-aligned)
    const reportData = {
      reportId,
      adminCode,
      propertyId,
      propertyName,
      unitCode,
      unitLabel,
      role,
      description,
      dateSubmitted: new Date(),
    };

    // 🧰 Only maintenance reports get these fields
    if (role === "maintenance") {
      reportData.category = category;
      reportData.urgency = urgency;
      reportData.dateAvailable = dateAvailable ? new Date(dateAvailable) : null;
      reportData.status = "NEW";
    }

    const newReport = new Report(reportData);
    const savedReport = await newReport.save();

    return res.status(201).json({
      message: "New report created successfully",
      report: savedReport,
    });
  } catch (error) {
    console.error("REPORT CREATE ERROR:", error);
    return res.status(400).json({
      message: "Failed to create report",
      error: error.message,
    });
  }
};

export const updateReportStatus = async (req, res) => {
  // Helpful for debugging during the transition
  console.log("PARAM ID (reportId):", req.params.id);
  console.log("NEW STATUS:", req.body.status);

  try {
    const { id } = req.params; // This matches the 'reportId' (e.g., MAINT-JOKM)
    const { status } = req.body;
    const { adminCode } = req.user; // Verified from token

    // We use { new: true } to get the updated document back in the response
    // We use { runValidators: true } to ensure 'status' is still NEW, seen, or Done
    const updatedReport = await Report.findOneAndUpdate(
      { reportId: id, adminCode: adminCode },
      { status: status },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found in database" });
    }

    return res.status(200).json({
      message: "Report status updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating report status",
      error: error.message,
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    console.log("get all hit");
    // 🔥 We IGNORE req.query and use the verified token data
    const { adminCode } = req.user;

    // This ensures you only find reports belonging to THIS admin's building
    const reports = await Report.find({ adminCode: adminCode });

    return res.status(200).json({
      message: "Reports retrieved successfully",
      count: reports.length,
      reports,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving reports", error: error.message });
  }
};
