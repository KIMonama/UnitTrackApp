import { validateForm } from "./validation.js";
import { inputValidate } from "./validation.js";

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

  fetch("http://localhost:3000/api/admins", {
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

