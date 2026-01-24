import { getCurrentUser } from "../state/session.js";

export const renderUserDetails = () => {
  const unitDetails = document.getElementById("unitDetails");

  // 🛡️ Guard #1: Element does not exist on this page
  if (!unitDetails) return;

  const user = getCurrentUser();
  // 🛡️ Guard #2: No user in session
  
  if (!user) {
    unitDetails.innerText = "Welcome";
    return;
  }

  // 🛡️ Role-based rendering
  if (user.role === "tenant") {
    unitDetails.innerText = `Welcome Tenant ${user.unitNumber}`;
  } else if (user.role === "admin") {
    unitDetails.innerText = `Welcome ${user.name}`;
  } else {
    unitDetails.innerText = "Welcome";
  }
};
