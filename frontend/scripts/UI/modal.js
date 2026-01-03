const openModal = (id, room, category, description, urgency, status, date) => {
  document.getElementById("modalRequestId").textContent = id;
  document.getElementById("modalRoom").textContent = room;
  document.getElementById("modalCategory").textContent = category;
  document.getElementById("modalDescription").textContent = description;
  document.getElementById("modalUrgency").textContent = urgency;
  document.getElementById("modalStatus").textContent = status;
  document.getElementById("modalDate").textContent = date;

  document
    .getElementById("modalUrgency")
    .classList.add(getUrgencyClass(urgency));
  document.getElementById("modalStatus").classList.add(getStatusClass(status));

  status === "Done" ? markAsDone() : resetDoneButton();

  const modal = new bootstrap.Modal(
    document.getElementById("viewRequestModal")
  );
  modal.show();
}

//Function to change the mark as done button after you click it

const markAsDone = () => {
  //initialise the variables
  const button = document.getElementById("doneButton");
  const buttonIcon = document.getElementById("buttonIcon");
  const buttonText = document.getElementById("buttonText");

  //change colour from blue to grey of the button
  button.classList.remove("btn-success");
  button.classList.add("btn-secondary");

  //change the icon
  // Update Icon (Using Bootstrap Icons class 'bi-check-lg')
  buttonIcon.classList.remove("bi-circle");
  buttonIcon.classList.add("bi-check-lg");
  // Update Text
  buttonText.innerText = "Done";

  // Optional: Disable button after clicking
  button.disabled = true;
  //Initialise the reportID and the new status
  //const requestID = document.getElementById("modalRequestId").innerHTML;
  //const newStatus ="Done";

  //Update the status on the server
  //updateReportStatus(requestID, newStatus);
};

//Function to reset the done button

const resetDoneButton = () => {
  const button = document.getElementById("doneButton");
  const buttonIcon = document.getElementById("buttonIcon");
  const buttonText = document.getElementById("buttonText");

  // Reset to original Green state
  button.classList.remove("btn-secondary");
  button.classList.add("btn-success");

  // Reset Icon to circle
  buttonIcon.classList.remove("bi-check-lg");
  buttonIcon.classList.add("bi-circle");

  // Reset Text
  buttonText.innerText = "Mark as Done";

  // Re-enable the button
  button.disabled = false;
};