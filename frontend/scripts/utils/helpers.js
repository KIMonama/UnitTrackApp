// Helper functions for colours
// Helper functions for the new cool badges
export function getUrgencyClass(urgency) {
  // Directly mapping the lowercase strings from your server
  switch (urgency) {
    case "emergency":
      return "badge-urgent";
    case "high":
      return "badge-urgent";
    case "medium":
      return "badge-warning";
    case "low":
      return "badge-stable";
    default:
      return "badge-neutral";
  }
}

export function getStatusClass(status) {
  switch (status) {
    case "Done":
      return "status-badge status-closed";
    case "Seen":
      return "status-badge status-progress";
    case "NEW":
      return "status-badge status-open";
    default:
      return "status-badge status-neutral";
  }
}

export const markInvalid = (input) => {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
};

export const markValid = (input) => {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
};

export const resetInputState = (input) => {
  input.classList.remove("is-invalid", "is-valid");
};

// A simple helper to generate IDs like: MAINT-X8J2 or COMP-Z9L1
export const generateReportId = (role) => {
  const prefix = role === "maintenance" ? "MAINT" : "COMP";
  // Generates a random 4-character alphanumeric string
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${randomStr}`;
};
export const getFormattedDate = () => {
  const date = new Date();

  // padStart ensures that Jan (1) becomes "01"
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getCategoryAccent = (category) => {
  switch (category) {
    case "Plumbing":
      return "border-start border-4 border-info"; // blue
    case "Electrical":
      return "border-start border-4 border-warning"; // yellow
    case "Doors":
      return "border-start border-4 border-secondary"; // gray
    case "Cleaning":
      return "border-start border-4 border-success"; // green
    case "Noise":
      return "border-start border-4 border-danger"; // red
    case "Other":
      return "border-start border-4 border-dark"; // dark
    default:
      return "border-start border-4 border-muted";
  }
};

export const getCategoryIcon = (category) => {
  switch (category) {
    case "Plumbing":
      return "bi-droplet-fill"; // 💧 water
    case "Electrical":
      return "bi-lightning-fill"; // ⚡ electricity
    case "Doors":
      return "bi-door-closed-fill"; // 🚪 doors
    case "Cleaning":
      return "bi-bucket-fill"; // 🪣 cleaning
    case "Noise":
      return "bi-volume-up-fill"; // 🔊 noise
    case "Other":
      return "bi-three-dots"; // …
    default:
      return "bi-question-circle"; // fallback
  }
};

// Function to calculate the tier based on your business model
export function calculateSubscriptionPlan(units, properties) {
  if (units <= 5 && properties <= 1) {
    return { name: "Starter Tier", price: "R99", color: "text-success" };
  } else if (units <= 20 && properties <= 2) {
    return { name: "Growth Tier", price: "R199", color: "text-primary" };
  } else if (units <= 50 && properties <= 5) {
    return { name: "Professional Tier", price: "R499", color: "text-warning" };
  } else {
    return { name: "Mogul Tier", price: "R999", color: "text-danger" };
  }
}
