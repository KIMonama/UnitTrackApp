// frontend/scripts/ui/modal.ui.js

import { getUrgencyClass, getStatusClass } from "../utils/helpers.js";
import { updateReportStatus } from "../api/reports.api.js";

let currentReportId = null;

export const initModalUI = () => {
  const doneButton = document.getElementById("doneButton");

  if (!doneButton) return;

  doneButton.addEventListener("click", () => {
    if (!currentReportId) return;
    updateReportStatus(currentReportId, "Done");
    setDoneState();
  });
};

export const openReportModal = (report) => {
  currentReportId = report.reportId;

  setText("modalRequestId", report.reportId);
  setText("modalRoom", report.unitLabel || report.tenantId);
  setText("modalCategory", report.category);
  setText("modalDescription", report.description);
  setText("modalUrgency", report.urgency);
  setText("modalStatus", report.status);
  setText("modalDate", report.dateSubmitted);

  setBadge("modalUrgency", getUrgencyClass(report.urgency));
  setBadge("modalStatus", getStatusClass(report.status));

  // ✅ NEW PART (ONLY THIS)
  if (report.status === "NEW") {
    updateReportStatus(currentReportId,"Seen");
  }
  report.status === "Done" ? setDoneState() : resetDoneState();

  const modal = new bootstrap.Modal(
    document.getElementById("viewRequestModal")
  );
  modal.show();
};

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const setBadge = (id, className) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `badge ${className}`;
};

const setDoneState = () => {
  const button = document.getElementById("doneButton");
  const icon = document.getElementById("buttonIcon");
  const text = document.getElementById("buttonText");

  button.classList.replace("btn-success", "btn-secondary");
  icon.classList.replace("bi-circle", "bi-check-lg");
  text.innerText = "Done";
  button.disabled = true;
};

const resetDoneState = () => {
  const button = document.getElementById("doneButton");
  const icon = document.getElementById("buttonIcon");
  const text = document.getElementById("buttonText");

  button.classList.replace("btn-secondary", "btn-success");
  icon.classList.replace("bi-check-lg", "bi-circle");
  text.innerText = "Mark as Done";
  button.disabled = false;
};
