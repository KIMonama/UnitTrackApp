const createNewReport = () => {
  const option = document.getElementById("mOrC").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("code").value;
  const urgency = document.getElementById("urgency").value;
  const dateSubmitted = document.getElementById("availableDate").value;

  fetch("http://localhost:3000/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reportId: Date.now(), // simple ID for now
      tenantId: "T1", // placeholder (OK for now)
      type: option,
      category: category,
      description: description,
      urgency: urgency,
      status: "NEW",
      dateSubmitted: dateSubmitted,
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