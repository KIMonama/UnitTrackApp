import { showStep } from "../ui/steps.ui.js";
import { registerUser } from "../api/register.api.js";

export function initRegisterForm() {
  document.getElementById("formStep1").addEventListener("submit", handleStep1);

  document.getElementById("formStep2").addEventListener("submit", handleStep2);
}

function handleStep1(e) {
  e.preventDefault();

  const data = {
    name: fullName.value,
    email: email.value,
    phone: phone.value,
    property: propName.value,
    unitCount: units.value,
  };

  sessionStorage.setItem("tempUser", JSON.stringify(data));
  showStep(2);
}

async function handleStep2(e) {
  e.preventDefault();

  const pass = document.getElementById("pass").value;
  const confirm = document.getElementById("confirmPass").value;

  if (pass !== confirm) return alert("Passwords don't match");

  const finalData = JSON.parse(sessionStorage.getItem("tempUser"));
  finalData.password = pass;

  await registerUser(finalData);
}
