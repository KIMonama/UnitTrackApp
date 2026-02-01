// frontend/scripts/ui/modal.ui.js

import { getUrgencyClass, getStatusClass } from "../utils/helpers.js";
import { updateReportStatus } from "../api/reports.api.js";
import { populateTableUI } from "../UI/table.js";

let currentReportId = null;
let activeReport = null;

export const initModalUI = () => {
  const doneButton = document.getElementById("doneButton");
  const shareButton = document.getElementById("shareButton");
  const modalEl = document.getElementById("viewRequestModal");

  if (!doneButton || !modalEl) return;

  doneButton.addEventListener("click", async (e) => {
    e.preventDefault(); // 🔒 stops form submission
    e.stopPropagation(); // 🔒 stops bubbling
    if (!currentReportId) return;

    try {
      await updateReportStatus(currentReportId, "Done");
      activeReport.status = "Done";
      setDoneState();
      alert("DONE");
      // Close modal programmatically
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      //await populateTableUI(); // refresh table immediately
    } catch (err) {
      console.error("Failed to mark as Done:", err);
    }
  });
  if (shareButton) {
    shareButton.addEventListener("click", handleShare);
  }
};

/* ============================
   OPEN MODAL
============================ */
export const openReportModal = async (report) => {
  currentReportId = report.reportId;
  activeReport = report;
  setText("modalRequestId", report.reportId);
  setText("modalRoom", report.unitLabel || report.tenantId);
  setText("modalCategory", report.category);
  setText("modalDescription", report.description);
  setText("modalUrgency", report.urgency);
  setText("modalStatus", report.status);
  setText("modalDate", report.dateSubmitted);
  setText("availableDate", report.dateAvailable);

  setBadge("modalUrgency", getUrgencyClass(report.urgency));
  setBadge("modalStatus", getStatusClass(report.status));

  // 🔥 AUTO: New → Seen when opening
  const modalEl = document.getElementById("viewRequestModal");
  const modal = new bootstrap.Modal(modalEl);

  //Set the modal done button if the status is done
  activeReport.status === "Done" ? setDoneState() : resetDoneState();

  // ✅ Only mark Seen AFTER viewing (on close)
  modalEl.addEventListener(
    "hidden.bs.modal",
    async () => {
      if (activeReport && activeReport.status === "NEW") {
        try {
          await updateReportStatus(activeReport.reportId, "Seen");
          activeReport.status = "Seen";
        } catch (err) {
          console.error("Failed to mark Seen:", err);
        }
      }
      // ✅ FORCE TABLE RELOAD AFTER MODAL CLOSE
      await populateTableUI();
    },
    { once: true }
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

const handleShare = async () => {
  if (!activeReport) return;

  const text = formatReportText(activeReport);

  // 📱 If device supports share (phones)
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Maintenance Request",
        text,
      });
    } catch (err) {
      console.warn("Share cancelled");
    }
  }
  // 💻 Else copy to clipboard
  else {
    await navigator.clipboard.writeText(text);
    alert("Report copied to clipboard");
  }
};

const formatReportText = (report) => {
  return `
Maintenance Request  Date submitted: ${report.dateSubmitted}

Unit: ${report.unitLabel}
Category: ${report.category}
Description: ${report.description}
Urgency: ${report.urgency}
Date Available: ${report.dateAvailable}
`.trim();
};
