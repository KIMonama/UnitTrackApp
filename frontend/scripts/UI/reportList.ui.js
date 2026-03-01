import { getTenantReports } from "../api/reports.api.js";

export const initReportsModal = async () => {
  const list = document.getElementById("reportsList");
  list.innerHTML = `<div class="p-3 text-center text-muted">Fetching...</div>`;
  try {
    const data = await getTenantReports();
    if (!data.reports || data.reports.length === 0) {
      list.innerHTML = `<div class="p-4 text-center text-muted">No reports found yet.</div>`;
      return;
    }

    list.innerHTML = data.reports
      .map(
        (r) => `
      <div class="list-group-item p-3 border-0 border-bottom report-item">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="fw-bold text-dark">${r.category || "Maintenance"}</span>
          <span class="status-badge bg-${r.status}">${formatStatus(
          r.status
        )}</span>
        </div>
        <small class="text-secondary">${new Date(
          r.dateSubmitted
        ).toLocaleDateString()}</small>
      </div>
    `
      )
      .join("");
  } catch (e) {
    list.innerHTML = `<div class="p-4 text-center text-danger">Could not load reports.</div>`;
  }
};

const formatStatus = (s) =>
  ({ NEW: "Report Submitted", Seen: "Seen by Manager", Done: "Resolved" }[s] ||
  s);
