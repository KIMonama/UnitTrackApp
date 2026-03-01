import express from "express";

import {
  logAreport,
  getAllAdminReports,
  updateReportStatus,
  getAllTenantReports,
} from "../controllers/report.controller.js";

const router = express.Router();

router.post("/", logAreport);
router.patch("/:id", updateReportStatus);
router.get("/admin", getAllAdminReports);
router.get("/tenant", getAllTenantReports);

export default router;
