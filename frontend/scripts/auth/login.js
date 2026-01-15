//Function to determine which page to open on log in

const logInPage = () => {
  const code = document.getElementById("code").value.trim();
  const SelectedOption = document.getElementById("logOption");
  const UserType = SelectedOption.value;

  //Input validation for the selected option
  if (UserType === "" || SelectedOption.selectedIndex === 0) {
    showError("Please select option");
    // Add red border
    document
      .getElementById("logOption")
      .classList.add("border", "border-danger", "border-2");

    return;
  } else {
    // Remove red border when valid
    document
      .getElementById("logOption")
      .classList.remove("border", "border-danger", "border-2");
  }

  // Input validation for the code
  if (!code) {
    showError("Please enter your code");
    document.getElementById("codeLabel").classList.add("text-danger");
    return;
  } else {
    // Remove red text when valid
    document.getElementById("codeLabel").classList.remove("text-danger");
  }
  // 3. Extra validation based on selected option
  if (UserType === "TENANT") {
    if (code.length !== 5 || isNaN(code)) {
      showError("Tenant code must be exactly 5 digits");
      return;
    } else {
      fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: UserType,
          unitCode: code,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid login details");
          }
          return response.json();
        })
        .then((data) => {
          // If backend confirms tenant exists
          window.location.href = "Tenant/report.html";
        })
        .catch((error) => {
          showError(error.message);
          document.getElementById("codeLabel").classList.add("text-danger");
        });
    }
  }
  if (UserType === "ADMIN") {
    if (code.length !== 3 || isNaN(code)) {
      showError("Phone number must be 3 digits");
      return;
    } else {
      //Fetch Owner data and validate

      fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: UserType,
          adminCode: code,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.message);
          }
          return response.json();
        })
        .then((data) => {
          // If backend confirms tenant exists
          window.location.href = "Owner/owner-dashboard.html";
        })
        .catch((error) => {
          showError(error.message);
          document.getElementById("codeLabel").classList.add("text-danger");
        });
    }
  }
};
