import { getCurrentUser } from "../state/session.js";

export const renderUserDetails = () => {
  const user = getCurrentUser();
  console.log("Debug - User Role detected:", user?.role);

  // 1. Critical Guard: If no user, reset and stop.
  if (!user) {
    const property = document.getElementById("propertyName");
    if (property) property.innerText = "Welcome";
    return;
  }

  // 2. Separate Logic by Role
  if (user.role === "admin") {
    renderAdminUI(user);
  } else if (user.role === "tenant") {
    renderTenantUI(user);
  }
};

// --- Helper Functions to keep it lightweight ---

const renderAdminUI = (user) => {
  const property = document.getElementById("propertyName");
  const welcome = document.getElementById("welcomeName");

  if (property) property.innerText = user.property || "UnitTrack Portfolio";
  // On dashboard, unitDetails might be used for Manager Name
  if (welcome) welcome.innerText = `Manager: ${user.name}`;
};

const renderTenantUI = (user) => {
  const unitDetails = document.getElementById("unitDetails");
  if (unitDetails) unitDetails.innerText = `${user.unitLabel}`;
};
