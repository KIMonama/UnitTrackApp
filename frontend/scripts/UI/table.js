import { fetchAllReports } from "../api/reports.api.js";
import { getCurrentUser } from "../state/session.js";
import {
  getStatusClass,
  getUrgencyClass,
  getCategoryAccent,
  getCategoryIcon,
} from "../utils/helpers.js";
import { openReportModal } from "./modal.ui.js";

export const populateTableUI = async (filterType = "maintenance") => {
  try {
    const tableBody = document.getElementById("requestsTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const user = getCurrentUser();
    if (!user || !user.adminCode) {
      console.warn("No admin logged in");
      return;
    }

    const allReports = await fetchAllReports(user.adminCode);
    // ✅ FILTER BY ROLE (maintenance / suggestions)
    const reports = allReports.filter((report) => report.role === filterType);

    const statusOrder = { NEW: 1, Seen: 2, Done: 3 };
    reports.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    console.log(reports);

    reports.forEach((report) => {
      const row =
        report.role === "maintenance"
          ? renderMaintenanceRow(report)
          : renderSuggestionRow(report);

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading reports:", error);
  }
};

const renderMaintenanceRow = (report) => {
  const row = document.createElement("tr");
  row.classList.add("shadow-sm");

  row.innerHTML = `
    <td class="bg-white rounded ps-3">
      <div class="d-flex justify-content-between align-items-start">

        <div>
          <strong>
            <i class="bi ${getCategoryIcon(report.category)} me-2"></i>
            ${report.unitLabel}
          </strong><br>

          <small class="text-muted">${report.category}</small>

          <span class="badge ${getUrgencyClass(report.urgency)}">
            ${report.urgency}
          </span>

          <span class="badge ${getStatusClass(report.status)} ms-1">
            ${report.status}
          </span>
        </div>

        <div>
          <button class="btn btn-sm btn-outline-primary view-btn">View</button>
        </div>

      </div>
    </td>
  `;

  row.querySelector(".view-btn").addEventListener("click", () => {
    openReportModal(report);
  });

  return row;
};

const renderSuggestionRow = (report) => {
  const row = document.createElement("tr");
  row.classList.add("shadow-sm");

  row.innerHTML = `
    <td class="bg-white rounded ps-3">
      <div class="d-flex justify-content-between align-items-start">

        <div>
          <strong>
            <i class="bi bi-chat-left-text me-2"></i>
            ${report.unitLabel}
          </strong><br>

          <small class="text-muted">Suggestion</small>

          <div class="mt-1 text-muted small">
            ${report.description}
          </div>

          <small class="text-muted d-block">
            ${report.dateSubmitted}
          </small>
        </div>

        

      </div>
    </td>
  `;
  return row;
};

export const initRoleTabs = () => {
  const tabs = document.querySelectorAll("#loginTabs .nav-link");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // remove active from all
      tabs.forEach((t) => t.classList.remove("active"));

      // activate clicked tab
      tab.classList.add("active");

      const role = tab.dataset.role;
      console.log("Tab selected:", role);

      // trigger table reload
      populateTableUI(role);
    });
  });
};

document.getElementById("refreshBtn").addEventListener("click", async () => {
  const activeTab = document.querySelector("#loginTabs .nav-link.active");

  // Get the role from that tab (defaulting to null or a specific role if none found)
  const activeRole = activeTab ? activeTab.dataset.role : null;
  await populateTableUI(activeRole);
});
