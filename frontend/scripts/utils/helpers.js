// Helper functions for colours
export function getUrgencyClass(urgency) {
  switch (urgency) {
    case "high":
      return "bg-danger";
    case "medium":
      return "bg-warning text-dark";
    case "low":
      return "bg-success";
    default:
      return "bg-secondary";
  }
}

export function getStatusClass(status) {
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
