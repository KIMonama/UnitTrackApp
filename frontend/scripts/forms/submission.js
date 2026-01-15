import { validateForm } from "./validation.js";
import { inputValidate } from "./validation.js";

const createNewReport = () => {
  const option = document.getElementById("mOrC");
  const category = document.getElementById("category");
  const description = document.getElementById("code");
  const urgency = document.getElementById("urgency");
  const dateSubmitted = document.getElementById("availableDate");

  inputValidate(option, category, description, urgency, dateSubmitted);

  fetch("http://localhost:3000/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reportId: Date.now(), // simple ID for now
      tenantId: "T1", // placeholder (OK for now)
      type: option.value,
      category: category.value,
      description: description.value,
      urgency: urgency.value,
      status: "NEW",
      dateSubmitted: dateSubmitted.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Cannot create a new report");
      }
      return response.json();
    })
    .then((data) => {
      // If backend confirms tenant exists
      window.location.href = "success.html";
    })
    .catch((error) => {
      showError(error.message);
      document.getElementById("codeLabel").classList.add("text-danger");
    });
};

const createNewAdmin = () => {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phoneNumber = document.getElementById("phone");
  const property = document.getElementById("property");
  const numberOfUnits = document.getElementById("numberOfUnits");

  // ONLY proceed if validation passes
  if (!validateForm(name, email, phoneNumber, numberOfUnits)) {
    console.log("Validation failed. Stopping request.");
    return;
  }

  fetch("http://localhost:3000/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      phone: phoneNumber.value,
      property: property.value,
      unitCount: numberOfUnits.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create owner account");
      }
      return response.json();
    })
    .then((data) => {
      // If backend confirms successful onboarding
      console.log(data.message);
      window.location.href = "../Owner/success.html";
    })
    .catch((error) => {
      console.log(error.message);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const reportBtn = document.getElementById('submitBtn1'); // Let's assume your report button has this ID

    // Only attach the Admin listener if we are on the Admin page
    if (submitBtn) {
        submitBtn.addEventListener('click', createNewAdmin);
    }

    // Only attach the Report listener if we are on the Report page
    if (reportBtn) {
        reportBtn.addEventListener('click', createNewReport); 
    }
});

