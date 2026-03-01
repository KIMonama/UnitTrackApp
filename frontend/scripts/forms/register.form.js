import { showStep } from "../UI/steps.ui.js";
import { calculateSubscriptionPlan } from "../utils/helpers.js";
import { registerUser } from "../api/register.api.js";
import { toggleError } from "../utils/ui.utils.js";

export function initRegisterForm() {
  // Select the elements
  const step1 = document.getElementById("formStep1");
  const step2 = document.getElementById("formStep2");
  const step3 = document.getElementById("formStep3");
  const propSelector = document.getElementById("propCountSelector");

  // Only add listeners if the element actually exists on the current page
  if (step1) step1.addEventListener("submit", handleStep1);
  if (step2) step2.addEventListener("submit", handleStep2);
  if (step3) step3.addEventListener("submit", handleStep3);

  if (propSelector) {
    propSelector.addEventListener("change", generatePropInputs);
  }
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

  // Get values
  const nameInput = document.getElementById("fullName").value.trim();
  const emailInput = document.getElementById("email").value.trim();
  const phoneInput = document.getElementById("phone").value.trim();

  // NAME
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(nameInput)) {
    toggleError("Name must contain only letters and spaces");
    return;
  }

  // EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput)) {
    toggleError("Please enter a valid email address");
    return;
  }

  // PHONE
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneInput)) {
    toggleError("Phone number must be 10 digits");
    return;
  }

  // ✅ ALL VALID
  toggleError(""); // hide error
  const data = { name: nameInput, email: emailInput, phone: phoneInput };
  sessionStorage.setItem("tempUser", JSON.stringify(data));
  showStep(2);
}

function handleStep2(e) {
  e.preventDefault();
  const propNames = document.querySelectorAll(".prop-name");
  const propUnits = document.querySelectorAll(".prop-units");

  let properties = [];
  let totalUnits = 0;

  const nameRegex = /^[A-Za-z0-9\s]+$/;
  for (let i = 0; i < propNames.length; i++) {
    const name = propNames[i].value.trim();
    const units = parseInt(propUnits[i].value);

    // Property name validation
    if (!name) {
      toggleError("Property name cannot be empty");
      return;
    }

    if (!nameRegex.test(name)) {
      toggleError("Property name can only contain letters and numbers");
      return;
    }

    // Units validation
    if (isNaN(units)) {
      toggleError("Units must be a number");
      return;
    }

    if (units < 1) {
      toggleError("Each property must have at least 1 unit");
      return;
    }

    properties.push({ name: name, units: units });
    totalUnits += units;
  }

  toggleError(""); // clear errors
  const data = JSON.parse(sessionStorage.getItem("tempUser"));
  data.properties = properties;
  data.totalUnits = totalUnits;

  sessionStorage.setItem("tempUser", JSON.stringify(data));
  showStep(3);
}

async function handleStep3(e) {
  e.preventDefault();
  // 1. Get the button and save the original content
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalContent = submitBtn.innerHTML;

  const pinInput = document.getElementById("pass").value.trim();
  const confirmPinInput = document.getElementById("confirmPass").value.trim();

  const pinRegex = /^[0-9]{4}$/;

  // 1️⃣ PIN format check
  if (!pinRegex.test(pinInput)) {
    toggleError("PIN must be exactly 4 digits");
    return;
  }

  // 2️⃣ Confirm PIN format check
  if (!pinRegex.test(confirmPinInput)) {
    toggleError("Confirm PIN must be exactly 4 digits");
    return;
  }

  // 3️⃣ Match check
  if (pinInput !== confirmPinInput) {
    toggleError("PIN and Confirm PIN do not match");
    return;
  }

  // ✅ Clear error
  toggleError("");

  const finalData = JSON.parse(sessionStorage.getItem("tempUser"));
  finalData.pin = pinInput;
  // Calculate the plan
  const planDetails = calculateSubscriptionPlan(
    finalData.totalUnits,
    finalData.properties.length
  );

  //initialise the plan details
  finalData.subscription = planDetails;
  // Store the plan details specifically for the success page to read
  sessionStorage.setItem(
    "registrationSuccessContext",
    JSON.stringify({
      userName: finalData.name,
      userEmail: finalData.email,
      plan: planDetails,
    })
  );

  console.log(finalData);
  try {
    // 2. Start Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Processing...
    `;
    await registerUser(finalData); // Save to DB
    window.location.href = "../register/reg-success.html";
  } catch (err) {
    // 3. Reset Button on Error
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalContent;
    alert("Registration failed: " + err.message);
  }
}
