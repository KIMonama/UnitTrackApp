const updateReportStatus = (newStatus, pass = 0) => {
  const requestID = document.getElementById("modalRequestId").innerHTML;
  const oldStatus = document.getElementById("modalStatus").innerHTML;

  if (oldStatus === "Done" && newStatus === "Seen") {
    return;
  } else {
    fetch(`http://localhost:3000/api/report/${requestID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update report status");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        location.reload(); // simple refresh after upda
      })
      .catch((error) => {
        showError(error.message);
      });
  }
};
