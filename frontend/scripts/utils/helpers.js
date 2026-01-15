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


