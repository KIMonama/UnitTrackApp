import { logNewreport } from "../api/reports.api.js";
import { validateReport } from "../validation/validation.js";
import { showError } from "../utils/ui.utils.js";
import { getActiveReportRole } from "../UI/report.ui.js";
import { generateReportId, getFormattedDate } from "../utils/helpers.js";

export const handleNewreport = async (event) => {
  console.log("form function hit");
  if (event) event.preventDefault(); // Stop the refresh immediately
  const role = getActiveReportRole();

  const error = validateReport(role); //const error = validateLogin(role, identifierInput);
  if (error) {
    showError(error);
    return;
  }

  try {
    const payload =
      role === "maintenance"
        ? {
            reportId : generateReportId(role),
            role: role,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            urgency: document.getElementById("urgency").value,
            dateAvailable: document.getElementById("availableDate").value,
            status: "NEW",
            dateSubmitted: getFormattedDate(),
          }
        : {
            reportId : generateReportId(role),
            role: role,
            description: document.getElementById("complaintsDescription").value,
            dateSubmitted: getFormattedDate(),
          };

    const data = await logNewreport(payload);

    // Redirects
    if (!data.ok) {
      throw new Error("Failed to log a report, try again later.");
    }
    console.log(data);
    console.log("Success! Redirecting...");
    window.location.href = "Tenant/success.html";
  } catch (err) {
    showError(err.message);
  }
};
