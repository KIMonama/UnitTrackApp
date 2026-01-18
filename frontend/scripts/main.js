// frontend/scripts/main.js

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

// Helper functions for colours
function getUrgencyClass(urgency) {
  switch (urgency) {
    case "High":
      return "bg-danger";
    case "Medium":
      return "bg-warning text-dark";
    case "Low":
      return "bg-success";
    default:
      return "bg-secondary";
  }
}

function getStatusClass(status) {
  switch (status) {
    case "Done":
      return "bg-secondary";
    case "Seen":
      return "bg-primary";
    case "NEW":
      return "bg-success";
    default:
      return "bg-secondary";
  }
}

function openModal(id, room, category, description, urgency, status, date) {
  document.getElementById("modalRequestId").textContent = id;
  document.getElementById("modalRoom").textContent = room;
  document.getElementById("modalCategory").textContent = category;
  document.getElementById("modalDescription").textContent = description;
  document.getElementById("modalUrgency").textContent = urgency;
  document.getElementById("modalStatus").textContent = status;
  document.getElementById("modalDate").textContent = date;

  document
    .getElementById("modalUrgency")
    .classList.add(getUrgencyClass(urgency));
  document.getElementById("modalStatus").classList.add(getStatusClass(status));

  status === "Done" ? markAsDone() : resetDoneButton();

  const modal = new bootstrap.Modal(
    document.getElementById("viewRequestModal")
  );
  modal.show();
}

//Function to change the mark as done button after you click it

const markAsDone = () => {
  //initialise the variables
  const button = document.getElementById("doneButton");
  const buttonIcon = document.getElementById("buttonIcon");
  const buttonText = document.getElementById("buttonText");

  //change colour from blue to grey of the button
  button.classList.remove("btn-success");
  button.classList.add("btn-secondary");

  //change the icon
  // Update Icon (Using Bootstrap Icons class 'bi-check-lg')
  buttonIcon.classList.remove("bi-circle");
  buttonIcon.classList.add("bi-check-lg");
  // Update Text
  buttonText.innerText = "Done";

  // Optional: Disable button after clicking
  button.disabled = true;
  //Initialise the reportID and the new status
  //const requestID = document.getElementById("modalRequestId").innerHTML;
  //const newStatus ="Done";

  //Update the status on the server
  //updateReportStatus(requestID, newStatus);
};

//Function to reset the done button

const resetDoneButton = () => {
  const button = document.getElementById("doneButton");
  const buttonIcon = document.getElementById("buttonIcon");
  const buttonText = document.getElementById("buttonText");

  // Reset to original Green state
  button.classList.remove("btn-secondary");
  button.classList.add("btn-success");

  // Reset Icon to circle
  buttonIcon.classList.remove("bi-check-lg");
  buttonIcon.classList.add("bi-circle");

  // Reset Text
  buttonText.innerText = "Mark as Done";

  // Re-enable the button
  button.disabled = false;
};

const updateReportStatus = (newStatus, pass = 0) => {
  const requestID = document.getElementById("modalRequestId").innerHTML;
  const oldStatus = document.getElementById("modalStatus").innerHTML;

  if (oldStatus === "Done" && newStatus === "Seen") {
    return;
  } else {
    fetch(`http://localhost:3000/api/report/${requestID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update report status");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        location.reload(); // simple refresh after upda
      })
      .catch((error) => {
        showError(error.message);
      });
  }
};

///////////////////////////////////////////////////////////
// IMPORTS
///////////////////////////////////////////////////////////

import { handleLogin } from "./forms/login.form.js";
import { handleNewreport } from "./forms/report.form.js";

import { initLoginUI } from "./UI/login.ui.js";
import { initReportUI } from "./UI/report.ui.js";

///////////////////////////////////////////////////////////
// DOM READY
///////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  // LOGIN PAGE
  initLoginUI();

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }

  // REPORT PAGE
  initReportUI();

  //const submitBtn = document.getElementById("submitBtn1");
  //if (submitBtn) {
  //submitBtn.addEventListener("click", handleNewreport);
  // }
  // To this:
  const reportForm = document.getElementById("reportForm"); // Use your <form> ID here
  if (reportForm) {
    reportForm.addEventListener("submit", (event) => {
      handleNewreport(event); // Pass the event object!
    });
  }
});
