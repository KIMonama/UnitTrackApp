
const inputValidate = () => {
  const option = document.getElementById("mOrC");
  const category = document.getElementById("category");
  const description = document.getElementById("code");
  const urgency = document.getElementById("urgency");
  const date = document.getElementById("availableDate");

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
      createNewReport();
    }
  }
};

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