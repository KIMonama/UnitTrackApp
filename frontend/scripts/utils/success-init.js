// success-init.js (Import this in reg-success.html)
document.addEventListener("DOMContentLoaded", () => {
  const context = JSON.parse(
    sessionStorage.getItem("registrationSuccessContext")
  );

  if (context) {
    // 1. Update Plan Details
    document.getElementById("planName").innerText = context.plan.name;
    document.getElementById(
      "planPrice"
    ).innerText = `${context.plan.price}/month`;
    document.getElementById(
      "planName"
    ).className = `plan-badge d-inline-block mb-2 ${context.plan.color}`;

    // 2. Personalize the message
    document.getElementById("userGreeting").innerText = `Welcome, ${
      context.userName.split(" ")[0]
    }!`;
    document.getElementById("displayEmail").innerText = context.userEmail;
  }
});
