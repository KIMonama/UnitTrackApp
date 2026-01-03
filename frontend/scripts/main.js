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

const inputValidate = () => {
  const option = document.getElementById("mOrC");
  const category = document.getElementById("category");
  const description = document.getElementById("code");
  const urgency = document.getElementById("urgency");
  const date = document.getElementById("availableDate");

  // Reset previous error styles
  document
    .getElementById("mOrC1")
    .classList.remove("border", "border-danger", "border-2");
  category.classList.remove("border", "border-danger", "border-2");
  description.classList.remove("border", "border-danger", "border-2");
  urgency.classList.remove("border", "border-danger", "border-2");
  date.classList.remove("border", "border-danger", "border-2");

  // 1️⃣ Check if user selected Maintenance or Complaint
  if (option.value === "" || option.value === "Maintenance/complaint") {
    showError("Please select Maintenance or Complaint");
    document
      .getElementById("mOrC1")
      .classList.add("border", "border-danger", "border-2");
    return;
  }

  // If COMPLAINT — no validation needed
  if (option.value === "Complaint") {
    // 3️⃣ Description required
    if (!description.value.trim()) {
      showError("Please enter a description of the issue");
      description.classList.add("border", "border-danger", "border-2");
      return;
    } else {
      window.location.href = "success.html";
    }
  } else {
    // From here on, ONLY Maintenance validation applies

    // 2️⃣ Category required
    if (category.selectedIndex === 0) {
      showError("Please select issue category");
      category.classList.add("border", "border-danger", "border-2");
      return;
    }

    // 3️⃣ Description required
    else if (!description.value.trim()) {
      showError("Please enter a description of the issue");
      description.classList.add("border", "border-danger", "border-2");
      return;
    }

    // 4️⃣ Urgency required
    else if (urgency.selectedIndex === 0) {
      showError("Please select how urgent the issue is");
      urgency.classList.add("border", "border-danger", "border-2");
      return;
    }

    // 5️⃣ Date required
    else if (!date.value) {
      showError("Please select the date you will be available");
      date.classList.add("border", "border-danger", "border-2");
      return;
    } else {
      // If all maintenance fields pass:
      //window.location.href = "success.html";
      createNewReport();
    }
  }
};

//Function to determine which page to open on log in

const logInPage = () => {
  const code = document.getElementById("code").value.trim();
  const SelectedOption = document.getElementById("logOption");
  const UserType = SelectedOption.value;

  //Input validation for the selected option
  if (UserType === "" || SelectedOption.selectedIndex === 0) {
    showError("Please select option");
    // Add red border
    document
      .getElementById("logOption")
      .classList.add("border", "border-danger", "border-2");

    return;
  } else {
    // Remove red border when valid
    document
      .getElementById("logOption")
      .classList.remove("border", "border-danger", "border-2");
  }

  // Input validation for the code
  if (!code) {
    showError("Please enter your code");
    document.getElementById("codeLabel").classList.add("text-danger");
    return;
  } else {
    // Remove red text when valid
    document.getElementById("codeLabel").classList.remove("text-danger");
  }
  // 3. Extra validation based on selected option
  if (UserType === "TENANT") {
    if (code.length !== 4 || isNaN(code)) {
      showError("Tenant code must be exactly 4 digits");
      return;
    } else {
      fetch(
        `http://localhost:3000/api/login?role=${UserType}&tenantCode=${code}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid login details");
          }
          return response.json();
        })
        .then((data) => {
          // If backend confirms tenant exists
          window.location.href = "Tenant/report.html";
        })
        .catch((error) => {
          showError(error.message);
          document.getElementById("codeLabel").classList.add("text-danger");
        });
    }
  }

  if (UserType === "OWNER") {
    if (code.length !== 10 || isNaN(code)) {
      showError("Phone number must be 10 digits");
      return;
    } else {
      //Fetch Owner data and validate

      fetch(`http://localhost:3000/api/login?role=${UserType}&phone=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid login details");
          }
          return response.json();
        })
        .then((data) => {
          // If backend confirms tenant exists
          window.location.href = "Owner/owner-dashboard.html";
        })
        .catch((error) => {
          showError(error.message);
          document.getElementById("codeLabel").classList.add("text-danger");
        });
    }
  }
};

const createNewReport = () => {
  const option = document.getElementById("mOrC").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("code").value;
  const urgency = document.getElementById("urgency").value;
  const dateSubmitted = document.getElementById("availableDate").value;

  fetch("http://localhost:3000/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reportId: Date.now(), // simple ID for now
      tenantId: "T1", // placeholder (OK for now)
      type: option,
      category: category,
      description: description,
      urgency: urgency,
      status: "NEW",
      dateSubmitted: dateSubmitted,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Cannot create a new report");
      }
      return response.json();
    })
    .then((data) => {
      // If backend confirms tenant exists
      window.location.href = "success.html";
    })
    .catch((error) => {
      showError(error.message);
      document.getElementById("codeLabel").classList.add("text-danger");
    });
};

//Error helper function to show pop ups in cases of errors
const showError = (message) => {
  //Initialise the elements
  const errorMessage = document.getElementById("errorMessage");
  const alert = document.getElementById("alert");

  //populate and display the error
  errorMessage.innerText = message;
  alert.classList.remove("d-none");
};

//function to grey out input elements in an event of a complaint entry

const greyOut = () => {
  const option = document.getElementById("mOrC").value;
  const fields = ["category", "inputGroupFile01", "urgency", "availableDate"];

  if (option === "Complaint") {
    // Disable and grey out all fields
    fields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      field.disabled = true;
      field.classList.add("text-muted", "bg-light");
    });
  } else {
    // RE-ENABLE all fields
    fields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      field.disabled = false;
      field.classList.remove("text-muted", "bg-light");
    });
  }
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
