import fs from "fs";
import { reportsFile } from "../config/path.js";
import Report from "../models/Report.js";

export const logAreport = async (req, res) => {
  try {
    console.log("hello");
    // 1. Create an instance of the model using data from the request body
    const newReport = new Report(req.body);

    // 2. Save it directly to MongoDB (Mongoose handles the "write" logic)
    // We use 'await' because database operations are asynchronous
    const savedReport = await newReport.save();

    // 3. Send back the professional response
    return res.status(201).json({
      message: "New report was created successfully",
      report: savedReport,
    });
  } catch (error) {
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

    // We use { new: true } to get the updated document back in the response
    // We use { runValidators: true } to ensure 'status' is still NEW, seen, or Done
    const updatedReport = await Report.findOneAndUpdate(
      { reportId: id },
      { status: status },
      { new: true, runValidators: true }
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
    const { adminCode} = req.query;

    // 1. Build a dynamic query object
    let query = {};

    // Only add adminCode to the query if the user provided it
    if (adminCode) {
      query.adminCode = adminCode;
    }
    const reports = await Report.find(query);

    // 3. Professional Response
    return res.status(200).json({
      message: "Reports retrieved successfully",
      count: reports.length, // Helpful for the frontend to know the total
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving reports",
      error: error.message,
    });
  }
};
