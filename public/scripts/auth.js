// Function to toggle between steps
function showStep(stepNum) {
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step" + stepNum).classList.add("active");
}

// Handle Step 1 Submission
document.getElementById("formStep1").addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect Step 1 Data
  const step1Data = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    propertyName: document.getElementById("propName").value,
    units: document.getElementById("units").value,
  };

  // Store in sessionStorage temporarily
  sessionStorage.setItem("tempUser", JSON.stringify(step1Data));

  // Move to next step
  showStep(2);
});

// Handle Step 2 Final Submission
document.getElementById("formStep2").addEventListener("submit", function (e) {
  e.preventDefault();

  const pass = document.getElementById("pass").value;
  const confirmPass = document.getElementById("confirmPass").value;

  if (pass !== confirmPass) {
    alert("Passwords do not match!");
    return;
  }

  // Retrieve Step 1 data
  const finalData = JSON.parse(sessionStorage.getItem("tempUser"));
  finalData.password = pass; // Add the password to the object

  console.log("Final Registration Data:", finalData);

  // NEXT: Here you will use fetch() to send finalData to your MongoDB/Express API
  alert(
    "Registration Complete for " +
      finalData.fullName +
      "! Check console for data."
  );

  // Optional: Clear session and redirect
  // sessionStorage.removeItem('tempUser');
  // window.location.href = "dashboard.html";
});
