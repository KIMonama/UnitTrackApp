// scripts/forms/login.ui.js

const tenantTab = document.querySelector('[data-role="TENANT"]');
const adminTab = document.querySelector('[data-role="ADMIN"]');

const tenantFields = document.getElementById("tenantFields");
const adminFields = document.getElementById("adminFields");

let activeRole = "TENANT"; // default

const switchRole = (role) => {
  activeRole = role;

  tenantTab.classList.toggle("active", role === "TENANT");
  adminTab.classList.toggle("active", role === "ADMIN");

  tenantFields.classList.toggle("d-none", role !== "TENANT");
  adminFields.classList.toggle("d-none", role !== "ADMIN");
};

tenantTab.addEventListener("click", () => switchRole("TENANT"));
adminTab.addEventListener("click", () => switchRole("ADMIN"));

export const getActiveRole = () => activeRole;
