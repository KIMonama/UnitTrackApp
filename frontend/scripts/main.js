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
    date: "2025-10-29"
  },
  {
    id: "202",
    room: "Room B1",
    category: "Electrical",
    description: "Light not working",
    urgency: "Medium",
    status: "Submitted",
    date: "2025-10-28"
  },
  {
    id: "203",
    room: "Room C3",
    category: "Cleaning",
    description: "Spillage on floor",
    urgency: "Low",
    status: "Resolved",
    date: "2025-10-27"
  }
];

// Function to populate table
function populateTable() {
  const tableBody = document.getElementById("requestsTableBody");

  sampleRequests.forEach(request => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${request.id} <br><small>${request.room}</small></td>
      <td>${request.category}<br><span class="badge ${getUrgencyClass(request.urgency)}">${request.urgency}</span></td>
      <td><span class="badge ${getStatusClass(request.status)}">${request.status}</span></td>
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
    case "High": return "bg-danger";
    case "Medium": return "bg-warning text-dark";
    case "Low": return "bg-success";
    default: return "bg-secondary";
  }
}

function getStatusClass(status) {
  switch (status) {
    case "Submitted": return "bg-secondary";
    case "In Progress": return "bg-warning text-dark";
    case "Resolved": return "bg-success";
    default: return "bg-secondary";
  }
}

function openModal(id, room, category, description, urgency, status, date) {
  document.getElementById('modalRequestId').textContent = id;
  document.getElementById('modalRoom').textContent = room;
  document.getElementById('modalCategory').textContent = category;
  document.getElementById('modalDescription').textContent = description;
  document.getElementById('modalUrgency').textContent = urgency;
  document.getElementById('modalStatus').textContent = status;
  document.getElementById('modalDate').textContent = date;

  const modal = new bootstrap.Modal(document.getElementById('viewRequestModal'));
  modal.show();
}
