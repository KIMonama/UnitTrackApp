import express from "express";

import {
  logAreport,
  getAllReports,
  updateReportStatus,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/", logAreport);
router.patch("/:id", updateReportStatus);
router.get("/", getAllReports);

export default router;
