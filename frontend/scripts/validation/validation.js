import * as helpers from "../utils/helpers.js";

export const validateLogin = (role) => {
  console.log("validation hit");

  // tenant VALIDATION

  if (role === "tenant") {
    const unitCode = document.getElementById("unitCode");
    helpers.resetInputState(unitCode);

    const value = unitCode.value.trim().toUpperCase();

    // 1️⃣ Empty check
    if (!value) {
      helpers.markInvalid(unitCode);
      return "Please enter your unit code";
    }

    // 2️⃣ Format check: AA99999 (2 letters + 5 digits)
    const unitCodePattern = /^[A-Z]{2}\d{5}$/;

    if (!unitCodePattern.test(value)) {
      helpers.markInvalid(unitCode);
      return "Unit code format is invalid (e.g. BL74201)";
    }

    // 3️⃣ Save back normalized value
    unitCode.value = value;

    helpers.markValid(unitCode);
    return null; // valid tenant login
  }
  // admin VALIDATION

  if (role === "admin") {
    const email = document.getElementById("email");
    const pin = document.getElementById("pin");

    // Email check
    if (!email || !email.value.trim()) {
      helpers.markInvalid(email);
      return "Please enter your email address";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      helpers.markInvalid(email);
      return "Please enter a valid email address";
    }

    // PIN check
    if (!pin || !pin.value.trim()) {
      helpers.markInvalid(pin);
      return "Please enter your PIN";
    }

    if (isNaN(pin.value) || pin.value.length !== 4) {
      helpers.markInvalid(pin);
      return "PIN must be exactly 4 digits";
    }

    return null; // valid admin login
  }

  // =========================
  // FALLBACK
  // =========================
  return "Invalid login role";
};

export const validateReport = (role) => {
  console.log("validation hit");
  // ===============================
  // MAINTENANCE REPORT
  // ===============================
  if (role === "maintenance") {
    const category = document.getElementById("category");
    const description = document.getElementById("description");
    const urgency = document.getElementById("urgency");
    const availableDate = document.getElementById("availableDate");

    // Category
    if (!category || category.selectedIndex === 0) {
      helpers.markInvalid(category);
      return "Please select an issue category";
    }
    helpers.markValid(category);

    // Description
    if (!description || !description.value.trim()) {
      helpers.markInvalid(description);
      return "Please describe the issue";
    }
    helpers.markValid(description);

    // Urgency
    if (!urgency || urgency.selectedIndex === 0) {
      helpers.markInvalid(urgency);
      return "Please select how urgent the issue is";
    }
    helpers.markValid(urgency);

    // Available date
    if (!availableDate || !availableDate.value) {
      helpers.markInvalid(availableDate);
      return "Please select a date you are available";
    }
    helpers.markValid(availableDate);

    return null; // ✅ valid
  }

  // ===============================
  // COMPLAINT / SUGGESTION
  // ===============================
  if (role === "complaints") {
    const description = document.getElementById("complaintsDescription");

    if (!description || !description.value.trim()) {
      helpers.markInvalid(description);
      return "Please describe your complaint or suggestion";
    }

    helpers.markValid(description);
    return null; // ✅ valid
  }

  return "Invalid report type";
};
