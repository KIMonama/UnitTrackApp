let activeRole = "tenant"; // default

export const initLoginUI = () => {
  const tenantTab = document.querySelector('[data-role="tenant"]');
  const adminTab = document.querySelector('[data-role="admin"]');

  const tenantFields = document.getElementById("tenantFields");
  const adminFields = document.getElementById("adminFields");

  // Guard: page check
  if (!tenantTab || !adminTab || !tenantFields || !adminFields) return;

  const switchRole = (role) => {
    activeRole = role;

    tenantTab.classList.toggle("active", role === "tenant");
    adminTab.classList.toggle("active", role === "admin");

    tenantFields.classList.toggle("d-none", role !== "tenant");
    adminFields.classList.toggle("d-none", role !== "admin");
  };

  tenantTab.addEventListener("click", () => switchRole("tenant"));
  adminTab.addEventListener("click", () => switchRole("admin"));
};

export const getActiveRole = () => activeRole;
