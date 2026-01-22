import { loginUser } from "../api/auth.api.js";
import { validateLogin } from "../validation/validation.js";
import { showError } from "../utils/ui.utils.js";
import { getActiveRole } from "../UI/login.ui.js";
import { saveCurrentUser } from "../state/session.js";


export const handleLogin = async () => {
  console.log("form function hit");

  const role = getActiveRole();

  const error = validateLogin(role); //const error = validateLogin(role, identifierInput);
  if (error) {
    showError(error);
    return;
  }

  try {
    const payload =
      role === "tenant"
        ? {
            role: role,
            unitCode: document.getElementById("unitCode").value.trim(),
          }
        : {
            role: role,
            email: document.getElementById("email").value.trim(),
            pin: document.getElementById("pin").value.trim(),
          };

    // 🔥 STEP 1: call API
    const data = await loginUser(payload);

    // 🔥 STEP 2: extract user
    const user = data.user;

    // 🔥 STEP 3: save user to sessionStorage
    saveCurrentUser(user);

    if (role === "tenant") {
      window.location.href = "Tenant/report.html";
    } else {
      window.location.href = "Owner/owner-dashboard.html";
    }
  } catch (err) {
    showError(err.message);
  }
};
