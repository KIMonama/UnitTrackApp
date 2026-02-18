// propertyHealth.ui.js
export const updatePropertyHealth = () => {
  const rawData = sessionStorage.getItem("currentDashboardData");
  if (!rawData) return;

  try {
    const allItems = JSON.parse(rawData);

    // 1. Filter Actionable items (Maintenance & Complaints)
    const actionableItems = allItems.filter((item) => {
      const role = item.role ? item.role.toLowerCase() : "";
      return role === "maintenance" || role === "complaints";
    });

    const totalActionable = actionableItems.length;
    const doneActionable = actionableItems.filter((item) => {
      const status = item.status ? item.status.toLowerCase() : "pending";
      return status === "done";
    }).length;
    const pendingActionable = totalActionable - doneActionable;

    // 2. Count Suggestions separately
    const suggestions = allItems.filter((item) => {
      const role = item.role ? item.role.toLowerCase() : "";
      return role === "complaints";
    }).length;

    // 3. Update UI with safety checks
    const elements = {
      total: document.getElementById("healthTotal"),
      pending: document.getElementById("healthPending"),
      done: document.getElementById("healthDone"),
      suggest: document.getElementById("healthSuggestions"),
    };

    if (elements.total) elements.total.innerText = totalActionable;
    if (elements.pending) elements.pending.innerText = pendingActionable;
    if (elements.done) elements.done.innerText = doneActionable;
    if (elements.suggest) elements.suggest.innerText = suggestions;
  } catch (error) {
    console.error("Error updating property health stats:", error);
  }
};
