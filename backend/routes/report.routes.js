import express from "express";

import {
  logReport,
  getAllReports,
  updateReportStatus,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/", logReport);
router.put("/:id", updateReportStatus);
router.get("/", getAllReports);

export default router;
