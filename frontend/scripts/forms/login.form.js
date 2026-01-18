import { loginUser } from "../api/auth.api.js";
import { validateLogin } from "../validation/validation.js";
import { showError } from "../utils/ui.utils.js";
import { getActiveRole } from "../UI/login.ui.js"

export const handleLogin = async () => {
  console.log("form function hit");

  const role = getActiveRole();

  //const identifierInput = document.getElementById("loginCode");

  const error = validateLogin(role);    //const error = validateLogin(role, identifierInput);
  if (error) {
    showError(error);
    return;
  }

  try {
    const payload =
      role.value === "tenant"
        ? { role: role.value, unitCode: identifierInput.value.trim() }
        : { role: role.value, adminCode: identifierInput.value.trim() };

    const data = await loginUser(payload);

    // Redirects 
    if (role.value === "tenant") {
      window.location.href = "Tenant/report.html";
    } else {
      window.location.href = "Owner/owner-dashboard.html";
    }
  } catch (err) {
    showError(err.message);
  }
};
