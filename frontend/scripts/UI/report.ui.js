let activeRole = "maintenance";

export const initReportUI = () => {
  const maintenanceTab = document.querySelector('[data-role="maintenance"]');
  const complaintsTab = document.querySelector('[data-role="complaints"]');

  const maintenanceFields = document.getElementById("maintenanceFields");
  const complaintsFields = document.getElementById("complaintsFields");

  if (
    !maintenanceTab ||
    !complaintsTab ||
    !maintenanceFields ||
    !complaintsFields
  ) {
    console.warn("Report UI not initialised: elements missing");
    return;
  }

  const switchRole = (role) => {
    activeRole = role;

    maintenanceTab.classList.toggle("active", role === "maintenance");
    complaintsTab.classList.toggle("active", role === "complaints");

    maintenanceFields.classList.toggle("d-none", role !== "maintenance");
    complaintsFields.classList.toggle("d-none", role !== "complaints");
  };

  maintenanceTab.addEventListener("click", () => switchRole("maintenance"));
  complaintsTab.addEventListener("click", () => switchRole("complaints"));
};

export const getActiveReportRole = () => activeRole;
