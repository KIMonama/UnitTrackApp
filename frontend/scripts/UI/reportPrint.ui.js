// reportPrint.ui.js
export const initReportPrint = () => {
  const generateBtn = document.getElementById("finalGenerateBtn");
  if (!generateBtn) return;

  generateBtn.addEventListener("click", () => {
    const rawData = sessionStorage.getItem("currentDashboardData");
    if (!rawData) {
      alert("Please refresh the dashboard to load report data.");
      return;
    }
    const allItems = JSON.parse(rawData);

    const selectedMonthVal = document.getElementById("reportMonthSelect").value;
    const filteredData = allItems.filter((item) => {
      const monthPart = item.dateSubmitted.split("-")[1];
      return monthPart === selectedMonthVal;
    });

    document.getElementById("printPropName").innerText =
      document.getElementById("propertyName").innerText;
    document.getElementById("printReportMonth").innerText = `Period: ${
      document.getElementById("reportMonthSelect").selectedOptions[0].text
    }`;

    const printTableBody = document.getElementById("printTableBody");
    printTableBody.innerHTML = "";
    let stats = { total: 0, maintenance: 0, complaints: 0 };

    filteredData.forEach((item) => {
      stats.total++;

      // 1. Distinguish between Maintenance and Complaints
      const isComplaint = item.role.toLowerCase() === "complaints";
      if (isComplaint) stats.complaints++;
      else stats.maintenance++;

      // 2. Status Mapping Logic
      // "Done" stays "Done". "Seen", "New", or anything else becomes "Pending"
      const rawStatus = item.status ? item.status.toLowerCase() : "new";
      const displayStatus = rawStatus === "done" ? "Done" : "Pending";
      const statusColor = displayStatus === "Done" ? "#166534" : "#d97706";

      // 3. Category Guard: If it's a complaint, hide category or show "General"
      const categoryDisplay = isComplaint
        ? ""
        : `<strong>${item.category}:</strong> `;

      const row = `
            <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px; font-size: 11px; color: #666;">${
                  item.dateSubmitted
                }</td>
                <td style="padding: 12px;">
                    <span style="color: ${
                      isComplaint ? "#f97316" : "#0d6efd"
                    }; font-weight: bold; font-size: 10px; text-transform: uppercase; background: #f8f9fa; padding: 2px 6px; border-radius: 4px;">
                        ${item.role}
                    </span>
                </td>
                <td style="padding: 12px; font-weight: 600;">${
                  item.unitLabel || "N/A"
                }</td>
                <td style="padding: 12px; line-height: 1.4;">
                    ${categoryDisplay}${
        item.description || "No description provided"
      }
                </td>
                <td style="padding: 12px; font-weight: bold; color: ${statusColor};">
                    ${displayStatus}
                </td>
            </tr>
        `;
      printTableBody.innerHTML += row;
    });

    document.getElementById("printTotalCount").innerText = stats.total;
    document.getElementById("printMaintCount").innerText = stats.maintenance;
    document.getElementById("printCompCount").innerText = stats.complaints;

    setTimeout(() => {
      window.print();
    }, 500);
  });
};
