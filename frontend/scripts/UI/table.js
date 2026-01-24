import { fetchAllReports } from "../api/reports.api.js";
import { getCurrentUser } from "../state/session.js";
import {
  getStatusClass,
  getUrgencyClass,
  getCategoryAccent,
  getCategoryIcon,
} from "../utils/helpers.js";

export const populateTableUI = async () => {
  try {
    const tableBody = document.getElementById("requestsTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const user = getCurrentUser();
    if (!user || !user.adminCode) {
      console.warn("No admin logged in");
      return;
    }

    const reports = await fetchAllReports(user.adminCode);

    const statusOrder = { New: 1, Seen: 2, Done: 3 };
    reports.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    console.log(reports);

    reports.forEach((report) => {
      const row = document.createElement("tr");
      row.className = getCategoryAccent(report.category);
      row.classList.add("shadow-sm");

      row.innerHTML = `
  <td class=" bg-white rounded ${getCategoryAccent(report.category)} ps-3">
    <div class="d-flex justify-content-between align-items-start">

      <!-- LEFT CONTENT -->
      <div>
        <strong>
          <i class="bi ${getCategoryIcon(report.category)} me-2"></i>
          ${report.unitLabel}
        </strong><br>

        <small class="text-muted">${report.category}</small><br>

        <span class="badge ${getUrgencyClass(report.urgency)}">
          ${report.urgency}
        </span>

        <span class="badge ${getStatusClass(report.status)} ms-1">
          ${report.status}
        </span>
      </div>

      <!-- RIGHT ACTION -->
      <div>
        <button class="btn btn-sm btn-outline-primary"
          onclick="openModal(
            '${report.reportId}',
            '${report.tenantId}',
            '${report.category}',
            '${report.description}',
            '${report.urgency}',
            '${report.status}',
            '${report.dateSubmitted}'
          )">
          View
        </button>
      </div>

    </div>
  </td>
`;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading reports:", error);
  }
};
