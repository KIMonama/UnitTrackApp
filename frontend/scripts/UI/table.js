import { fetchAllReports } from "../api/reports.api.js";
import { getCurrentUser } from "../state/session.js";
import {
  getStatusClass,
  getUrgencyClass,
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
    sessionStorage.setItem('currentDashboardData', JSON.stringify(allReports));
    // ✅ FILTER BY ROLE (maintenance / complaints)
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
  // Reduced margin from mb-3 to mb-2, removed shadow-sm
  row.classList.add("d-block", "mb-2", "border-0");

  row.innerHTML = `
    <td class="bg-white rounded-3 p-2 d-block border-bottom">
      <div class="d-flex justify-content-between align-items-center">

        <div style="line-height: 1.2;">
          <div class="mb-1">
            <strong class="text-dark small">
              <i class="bi ${getCategoryIcon(
                report.category
              )} me-1 text-primary"></i>
              ${report.unitLabel}
            </strong>
          </div>
          <div class="d-flex align-items-center gap-2">
            <small class="text-muted x-small">${report.category}</small>
            <span class="status-badge ${getUrgencyClass(
              report.urgency
            )} x-small py-0 px-2">
              ${report.urgency}
            </span>
          </div>
        </div>

        <div class="text-end">
          <div class="mb-1">
             <span class="status-badge ${getStatusClass(
               report.status
             )} x-small py-0 px-2">
              ${report.status}
            </span>
          </div>
          <button class="btn btn-sm btn-outline-primary py-0 px-3 rounded-pill view-btn" style="font-size: 0.75rem;">
            View
          </button>
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

const refreshBtn = document.getElementById("refreshBtn");

// Only run the code if the button actually exists on the current page
if (refreshBtn) {
  refreshBtn.addEventListener("click", async () => {
    const activeTab = document.querySelector("#loginTabs .nav-link.active");
    // Get the role from that tab (defaulting to null or a specific role if none found)
    const activeRole = activeTab ? activeTab.dataset.role : null;
    await populateTableUI(activeRole);
  });
}
