import { getCurrentUser } from "../state/session.js";
import { populateTableUI } from "./table.js";
import { setSelectedProperty } from "./table.js";

export const renderUserDetails = () => {
  const user = getCurrentUser();
  console.log("Debug - User Role detected:", user.role);

  // 2. Separate Logic by Role
  if (user.role === "admin") {
    renderAdminUI(user);
  } else if (user.role === "tenant") {
    renderTenantUI(user);
  }
};

// --- Helper Functions to keep it lightweight ---

const renderAdminUI = (user) => {
  const welcome = document.getElementById("welcomeName");
  const propertyPill = document.getElementById("ownerPropertyPill");

  console.log(user);

  // Welcome text
  if (welcome) {
    welcome.innerText = `Admin: ${user.name}`;
  }

  // Guard: no properties
  if (!user.properties || user.properties.length === 0) {
    if (propertyPill) {
      propertyPill.innerHTML = `<option disabled selected>No properties</option>`;
      propertyPill.disabled = true;
    }
    return;
  }

  const properties = user.properties;

  // Default active property = first one
  let activeProperty = properties[0];
  setSelectedProperty(activeProperty);
  // Initialize pill dropdown
  if (propertyPill) {
    propertyPill.disabled = false;
    propertyPill.innerHTML = ""; // clear loading state

    properties.forEach((property, index) => {
      const option = document.createElement("option");
      option.value = property.id || index;
      option.textContent = property.propertyName;

      if (index === 0) option.selected = true; // default

      propertyPill.appendChild(option);
    });

    // Initial table render with default property
    console.log("Default Property:", activeProperty);
    populateTableUI(undefined, activeProperty);

    // Handle change
    propertyPill.addEventListener("change", (e) => {
      const selectedIndex = e.target.selectedIndex;
      const selectedProperty = properties[selectedIndex];

      console.log("Selected Property:", selectedProperty.propertyName);

      // 🔜 Hook into your table render
      setSelectedProperty(selectedProperty);
      populateTableUI(undefined, selectedProperty);
    });
  }
};
const renderTenantUI = (user) => {
  const unitDetails = document.getElementById("unitDetails");
  if (unitDetails) unitDetails.innerText = `${user.unitLabel}`;
  const propertyName = document.getElementById("display-property-name");
  if (propertyName) propertyName.innerText = `${user.propertyName}`;
};
