import { showStep } from "../UI/steps.ui.js";
import { calculateSubscriptionPlan } from "../../../public/scripts/util/helpers.js";
import { registerUser } from "../api/register.api.js";

export function initRegisterForm() {
  // Listeners for the 3 steps
  document.getElementById("formStep1").addEventListener("submit", handleStep1);
  document.getElementById("formStep2").addEventListener("submit", handleStep2);
  document.getElementById("formStep3").addEventListener("submit", handleStep3);

  // Listener for dynamic property generation
  document
    .getElementById("propCountSelector")
    .addEventListener("change", generatePropInputs);
}

function generatePropInputs(e) {
  const count = parseInt(e.target.value);
  const container = document.getElementById("dynamicPropsContainer");
  container.innerHTML = ""; // Reset

  for (let i = 1; i <= count; i++) {
    container.innerHTML += `
            <div class="property-entry bg-light p-3 rounded-3 mb-2 border">
                <div class="row g-2">
                    <div class="col-8"><input type="text" class="form-control prop-name" placeholder="Property ${i} Name" required></div>
                    <div class="col-4"><input type="number" class="form-control prop-units" placeholder="Units" required></div>
                </div>
            </div>`;
  }
}

function handleStep1(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };
  sessionStorage.setItem("tempUser", JSON.stringify(data));
  showStep(2);
}

function handleStep2(e) {
  e.preventDefault();
  const propNames = document.querySelectorAll(".prop-name");
  const propUnits = document.querySelectorAll(".prop-units");

  let properties = [];
  let totalUnits = 0;

  propNames.forEach((el, i) => {
    const units = parseInt(propUnits[i].value);
    properties.push({ name: el.value, units: units });
    totalUnits += units;
  });

  const data = JSON.parse(sessionStorage.getItem("tempUser"));
  data.properties = properties;
  data.totalUnits = totalUnits;

  sessionStorage.setItem("tempUser", JSON.stringify(data));
  showStep(3);
}

async function handleStep3(e) {
  e.preventDefault();
  // ... existing PIN validation logic ...

  const finalData = JSON.parse(sessionStorage.getItem("tempUser"));
  finalData.pin = document.getElementById("pass").value;

  // Calculate the plan
  const planDetails = calculateSubscriptionPlan(
    finalData.totalUnits,
    finalData.properties.length
  );

  // Store the plan details specifically for the success page to read
  sessionStorage.setItem(
    "registrationSuccessContext",
    JSON.stringify({
      userName: finalData.name,
      userEmail: finalData.email,
      plan: planDetails,
    })
  );

  try {
    // await registerUser(finalData); // Save to DB
    window.location.href = "/public/reg-success.html";
  } catch (err) {
    alert("Registration failed: " + err.message);
  }
}
