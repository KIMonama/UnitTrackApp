import * as helpers from "../utils/helpers.js";

export const validateLogin = (role) => {
  console.log("validation hit");

  // TENANT VALIDATION

  if (role === "TENANT") {
    const unitCode = document.getElementById("unitCode");

    if (!unitCode.value.trim()) {
      helpers.markInvalid(unitCode);
      document.getElementById("codeLabel").classList.add("text-danger");
      return "Please enter your unit code";
    }

    if (unitCode.value.trim().length !== 5) {
      return "Unit code must be exactly 5 characters";
    }

    return null; // valid tenant login
  }

  // ADMIN VALIDATION

  if (role === "ADMIN") {
    const email = document.getElementById("email");
    const pin = document.getElementById("pin");

    // Email check
    if (!email || !email.value.trim()) {
      return "Please enter your email address";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      return "Please enter a valid email address";
    }

    // PIN check
    if (!pin || !pin.value.trim()) {
      return "Please enter your PIN";
    }

    if (isNaN(pin.value) || pin.value.length !== 4) {
      return "PIN must be exactly 4 digits";
    }

    return null; // valid admin login
  }

  // =========================
  // FALLBACK
  // =========================
  return "Invalid login role";
};
