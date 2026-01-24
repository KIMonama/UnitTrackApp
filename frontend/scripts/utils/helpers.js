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
  switch (category.toLowerCase()) {
    case "plumbing":
      return "border-start border-4 border-info";
    case "electricity":
      return "border-start border-4 border-warning";
    case "cleaning":
      return "border-start border-4 border-success";
    case "water":
      return "border-start border-4 border-primary";
    default:
      return "border-start border-4 border-secondary";
  }
};

export const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case "plumbing":
      return "bi-droplet";
    case "electricity":
      return "bi-lightning";
    case "cleaning":
      return "bi-bucket";
    case "water":
      return "bi-water";
    default:
      return "bi-clipboard";
  }
};
