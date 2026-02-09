///////////////////////////////////////////////////////////
// IMPORTS
///////////////////////////////////////////////////////////

import { handleLogin } from "./forms/login.form.js";
import { handleNewreport } from "./forms/report.form.js";

import { initLoginUI } from "./UI/login.ui.js";
import { initReportUI } from "./UI/report.ui.js";

import { renderUserDetails } from "./UI/user.ui.js";
import { populateTableUI } from "./UI/table.js";
import { getCurrentUser } from "./state/session.js";
import { initModalUI } from "./UI/modal.ui.js";
import { initRoleTabs } from "./UI/table.js";

///////////////////////////////////////////////////////////
// DOM READY
///////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  // LOGIN PAGE
  // initLoginUI();

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    initLoginUI();
    loginBtn.addEventListener("click", handleLogin);
  }

  // REPORT PAGE

  const reportForm = document.getElementById("reportForm"); // Use your <form> ID here
  if (reportForm) {
    initReportUI();
    reportForm.addEventListener("submit", (event) => {
      handleNewreport(event); // Pass the event object!
    });
  }
  // =========================
  // DASHBOARD PAGE
  // =========================
  const tableBody = document.getElementById("requestsTableBody");
  if (tableBody) {
    const user = getCurrentUser();

    if (!user) {
      console.warn("No user in session");
      return;
    }
    renderUserDetails(); // sets Welcome Admin XXX
    populateTableUI(); // fetches reports + renders table
    initModalUI();
    initRoleTabs();
  }

  const unitDetails = document.getElementById("unitDetails");
  if(unitDetails)
  {
    renderUserDetails(); //sets room label on the reports page.
  }
});
