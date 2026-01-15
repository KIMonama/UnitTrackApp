export const inputValidate = (option,category,description,urgency,date) => {
  
  // Reset previous error styles
  document
    .getElementById("mOrC1")
    .classList.remove("border", "border-danger", "border-2");
  category.classList.remove("border", "border-danger", "border-2");
  description.classList.remove("border", "border-danger", "border-2");
  urgency.classList.remove("border", "border-danger", "border-2");
  date.classList.remove("border", "border-danger", "border-2");

  // 1️⃣ Check if user selected Maintenance or Complaint
  if (option.value === "" || option.value === "Maintenance/complaint") {
    showError("Please select Maintenance or Complaint");
    document
      .getElementById("mOrC1")
      .classList.add("border", "border-danger", "border-2");
    return;
  }

  // If COMPLAINT — no validation needed
  if (option.value === "Complaint") {
    // 3️⃣ Description required
    if (!description.value.trim()) {
      showError("Please enter a description of the issue");
      description.classList.add("border", "border-danger", "border-2");
      return;
    } else {
      window.location.href = "success.html";
    }
  } else {
    // From here on, ONLY Maintenance validation applies

    // 2️⃣ Category required
    if (category.selectedIndex === 0) {
      showError("Please select issue category");
      category.classList.add("border", "border-danger", "border-2");
      return;
    }

    // 3️⃣ Description required
    else if (!description.value.trim()) {
      showError("Please enter a description of the issue");
      description.classList.add("border", "border-danger", "border-2");
      return;
    }

    // 4️⃣ Urgency required
    else if (urgency.selectedIndex === 0) {
      showError("Please select how urgent the issue is");
      urgency.classList.add("border", "border-danger", "border-2");
      return;
    }

    // 5️⃣ Date required
    else if (!date.value) {
      showError("Please select the date you will be available");
      date.classList.add("border", "border-danger", "border-2");
      return;
    } else {
      // If all maintenance fields pass:
      //window.location.href = "success.html";
      //createNewReport();
    }
  }
};

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
////Helper function to grey out some fields in case of a complaints

const greyOut = () => {
  const option = document.getElementById("mOrC").value;
  const fields = ["category", "inputGroupFile01", "urgency", "availableDate"];

  if (option === "Complaint") {
    // Disable and grey out all fields
    fields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      field.disabled = true;
      field.classList.add("text-muted", "bg-light");
    });
  } else {
    // RE-ENABLE all fields
    fields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      field.disabled = false;
      field.classList.remove("text-muted", "bg-light");
    });
  }
};
