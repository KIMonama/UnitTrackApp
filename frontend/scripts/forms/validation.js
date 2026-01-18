///Function to validate the get started form
export const validateForm = (nameInput, emailInput, phoneInput, unitsInput) => {
  let isValid = true;

  // 1. Regex Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(0|(\+27))[6-8][0-9]{8}$/; // SA Standard: 072..., 081..., etc.
  const nameRegex = /^[a-zA-Z\s]{3,50}$/; // Letters and spaces only, 3-50 chars

  // 2. Perform Checks
  toggleError(nameInput, nameRegex.test(nameInput.value.trim()));
  toggleError(emailInput, emailRegex.test(emailInput.value.trim()));
  toggleError(
    phoneInput,
    phoneRegex.test(phoneInput.value.trim().replace(/\s/g, ""))
  ); // Remove spaces for check
  toggleError(
    unitsInput,
    !isNaN(unitsInput.value) && parseInt(unitsInput.value) > 0
  );

  return isValid;
};

////////////////// HELPER FUNCTIONS  ////////////////////

// Helper function to show/hide errors
const toggleError = (input, condition) => {
  if (condition) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    isValid = false;
    return false;
  }
};

//Error helper function to show pop ups in cases of errors
const showError = (message) => {
  //Initialise the elements
  const errorMessage = document.getElementById("errorMessage");
  const alert = document.getElementById("alert");

  //populate and display the error
  errorMessage.innerText = message;
  alert.classList.remove("d-none");
};
