import { logNewreport } from "../api/reports.api.js";
import { validateReport } from "../validation/validation.js";
import { showError } from "../utils/ui.utils.js";
import { getActiveReportRole } from "../UI/report.ui.js";
import { sendWhatsAppReport } from "../UI/report.ui.js";
import { generateReportId, getFormattedDate } from "../utils/helpers.js";
import { getCurrentUser } from "../state/session.js";

export const handleNewreport = async (event) => {
  console.log("form function hit");
  if (event) event.preventDefault();

  const reportRole = getActiveReportRole(); // "maintenance" or "suggestion"
  const error = validateReport(reportRole);
  if (error) {
    showError(error);
    return;
  }

  const user = getCurrentUser(); // from session/local storage

  try {
    const basePayload = {
      reportId: generateReportId(reportRole),

      adminCode: user.adminCode,
      propertyId: user.propertyId,
      propertyName: user.propertyName,

      unitCode: user.unitCode,
      unitLabel: user.unitLabel,

      role: reportRole,
      dateSubmitted: new Date(), // let backend store as Date
    };

    const payload =
      reportRole === "maintenance"
        ? {
            ...basePayload,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            urgency: document.getElementById("urgency").value,
            dateAvailable: new Date(
              document.getElementById("availableDate").value
            ),
            status: "NEW",
          }
        : {
            ...basePayload,
            description: document.getElementById("complaintsDescription").value,
          };

    const data = await logNewreport(payload);

    sendWhatsAppReport();

    setTimeout(() => {
      window.location.href = "/frontend/Tenant/success.html";
    }, 1000);
  } catch (err) {
    showError(err.message);
  }
};
