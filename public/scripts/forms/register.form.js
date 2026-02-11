import { showStep } from "../ui/steps.ui.js";
import { registerUser } from "../api/register.api.js";

export function initRegisterForm() {
  document.getElementById("formStep1").addEventListener("submit", handleStep1);
  document.getElementById("formStep2").addEventListener("submit", handleStep2);
}

function handleStep1(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    property: document.getElementById("propName").value,
    unitCount: document.getElementById("units").value,
  };

  // Temporarily store data while we move to the PIN step
  sessionStorage.setItem("tempUser", JSON.stringify(data));
  showStep(2);
}

async function handleStep2(e) {
  e.preventDefault();

  const pin = document.getElementById("pass").value; // Variable changed to 'pin'
  const confirm = document.getElementById("confirmPass").value;

  // 1. Validation: Match check
  if (pin !== confirm) return alert("PINs do not match");

  // 2. Validation: Ensure it's numeric (Optional but recommended for PINs)
  if (isNaN(pin)) return alert("PIN must contain only numbers");

  const finalData = JSON.parse(sessionStorage.getItem("tempUser"));

  // 3. Match the Backend Schema: Use 'pin' instead of 'password'
  finalData.pin = pin;

  try {
    await registerUser(finalData);
    window.location.href = "/public/reg-success.html";
  } catch (err) {
    alert("Registration failed: " + err.message);
  }
}
