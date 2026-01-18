// Function to populate table
function populateTable() {
  const tableBody = document.getElementById("requestsTableBody");
  tableBody.innerHTML = "";
  fetch("/frontend/data/reports.json")
    .then((res) => res.json())
    .then((reports) => {
      // Sort first (New → Seen → Done)
      const statusOrder = { New: 1, Seen: 2, Done: 3 };
      reports.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

      reports.forEach((report) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>
            <div class="d-flex justify-content-between align-items-start">
              
              <!-- Left info -->
              <div>
                <strong>Room ${report.tenantId}</strong><br>
                <small class="text-muted">${report.category}</small><br>

                <span class="badge ${getUrgencyClass(report.urgency)}">
                  ${report.urgency}
                </span>
                <span class="badge ${getStatusClass(report.status)} ms-1">
                  ${report.status}
                </span>
              </div>

              <!-- Action -->
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
    })
    .catch((error) => console.error("Error loading reports:", error));
}
