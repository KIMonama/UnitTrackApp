// frontend/scripts/main.js
// Sample data (will later come from JSON)
const sampleRequests = [
  {
    id: "201",
    room: "Room A2",
    category: "Plumbing",
    description: "Leaking tap in kitchen",
    urgency: "High",
    status: "In Progress",
    date: "2025-10-29",
  },
  {
    id: "202",
    room: "Room B1",
    category: "Electrical",
    description: "Light not working",
    urgency: "Medium",
    status: "Submitted",
    date: "2025-10-28",
  },
  {
    id: "203",
    room: "Room C3",
    category: "Cleaning",
    description: "Spillage on floor",
    urgency: "Low",
    status: "Resolved",
    date: "2025-10-27",
  },
];

// Function to populate table
function populateTable() {
  const tableBody = document.getElementById("requestsTableBody");

  sampleRequests.forEach((request) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${request.id} <br><small>${request.room}</small></td>
      <td>${request.category}<br><span class="badge ${getUrgencyClass(
      request.urgency
    )}">${request.urgency}</span></td>
      <td><span class="badge ${getStatusClass(request.status)}">${
      request.status
    }</span></td>
      <td>${request.date}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="openModal(
          '${request.id}',
          '${request.room}',
          '${request.category}',
          '${request.description}',
          '${request.urgency}',
          '${request.status}',
          '${request.date}'
        )">View</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
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
    case "Submitted":
      return "bg-secondary";
    case "In Progress":
      return "bg-warning text-dark";
    case "Resolved":
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

  const modal = new bootstrap.Modal(
    document.getElementById("viewRequestModal")
  );
  modal.show();
}

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
      window.location.href = "success.html";
    }
  }
};

//Function to populate the Enter units table
const enterUnits = () => {
  const units = parseInt(document.getElementById("units").value);
  const tableBody = document.getElementById("unitsTableBody");
  tableBody.innerHTML = "";

  for (let i = 0; i < units; i++) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="text" class="form-control" placeholder="Example: 081 435 0822" aria-label="Username" aria-describedby="basic-addon1"></td>
      `;

    tableBody.appendChild(row);
  }
};

//Function to determine which page to open on log in

const logInPage = () => {
  const code = document.getElementById("code").value.trim();
  const SelectedOption = document.getElementById("logOption");
  const SelectedOptionValue = SelectedOption.value;

  //Input validation for the selected option
  if (SelectedOptionValue === "" || SelectedOption.selectedIndex === 0) {
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
  if (SelectedOptionValue === "TENANT") {
    if (code.length !== 4 || isNaN(code)) {
      showError("Tenant code must be exactly 4 digits");
      return;
    }
  }

  if (SelectedOptionValue === "OWNER") {
    if (code.length !== 10 || isNaN(code)) {
      showError("Phone number must be 10 digits");
      return;
    }
  }

  //Fetch the data and validate

  fetch("data/tenants.json")
    .then((request) => request.json())
    .then((tenants) => {
      // Find matching tenant
      const foundTenant = tenants.find((tenant) => code === tenant.tenantId);
      //check navigation logic
      if (SelectedOptionValue === "TENANT" && foundTenant) {
        window.location.href = "Tenant/report.html";
      } else if (SelectedOptionValue === "OWNER") {
        window.location.href = "Owner/owner-dashboard.html";
      } else {
        showError("Invalid login details");
        document.getElementById("codeLabel").classList.add("text-danger");
      }
    })
    .catch((error) => console.error("Error loading JSON:", error));
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
