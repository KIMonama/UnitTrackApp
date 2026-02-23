import { logNewreport } from "../api/reports.api.js";
import { validateReport } from "../validation/validation.js";
import { showError } from "../utils/ui.utils.js";
import { getActiveReportRole } from "../UI/report.ui.js";
import { sendWhatsAppReport } from "../UI/report.ui.js";
import { generateReportId, getFormattedDate } from "../utils/helpers.js";
import { getCurrentUser } from "../state/session.js";

export const handleNewreport = async (event) => {
  console.log("form function hit");
  if (event) event.preventDefault(); // Stop the refresh immediately
  const role = getActiveReportRole();

  const error = validateReport(role); //const error = validateLogin(role, identifierInput);
  if (error) {
    showError(error);
    return;
  }
  const user = getCurrentUser();

  try {
    const payload =
      role === "maintenance"
        ? {
            reportId: generateReportId(role),
            // adminCode: user.adminCode,
            unitLabel: user.unitLabel,
            role: role,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            urgency: document.getElementById("urgency").value,
            dateAvailable: document.getElementById("availableDate").value,
            status: "NEW",
            dateSubmitted: getFormattedDate(),
          }
        : {
            reportId: generateReportId(role),
            //adminCode: user.adminCode,
            unitLabel: user.unitLabel,
            role: role,
            description: document.getElementById("complaintsDescription").value,
            dateSubmitted: getFormattedDate(),
          };

    const data = await logNewreport(payload);

    alert("thus far");
    sendWhatsAppReport();
    // Redirects
    //window.location.href = "/frontend/Tenant/success.html";
    // Redirects
    // window.location.href = "/frontend/Tenant/success.html";
    setTimeout(() => {
      window.location.href = "/frontend/Tenant/success.html";
    }, 1000);
  } catch (err) {
    showError(err.message);
  }
};
