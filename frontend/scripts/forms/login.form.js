import { loginUser } from "../api/auth.api.js";
import { validateLogin } from "../validation/validation.js";
import { showError } from "../utils/ui.utils.js";

export const handleLogin = async () => {
  console.log("form function hit");

  const role = document.getElementById("logOption");
  const identifierInput = document.getElementById("loginCode");

  const error = validateLogin(role, identifierInput);
  if (error) {
    showError(error);
    return;
  }

  try {
    const payload =
      role.value === "TENANT"
        ? { role: role.value, unitCode: identifierInput.value }
        : { role: role.value, adminCode: identifierInput.value };

    const data = await loginUser(payload);

    // Redirects (same behavior as before)
    if (role.value === "TENANT") {
      window.location.href = "Tenant/report.html";
    } else {
      window.location.href = "Owner/owner-dashboard.html";
    }
  } catch (err) {
    showError(err.message);
  }
};
