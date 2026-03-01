export const showError = (message) => {
  const alert = document.getElementById("alert");
  const errorMessage = document.getElementById("errorMessage");

  errorMessage.innerText = message;
  alert.classList.remove("d-none");
};

export const toggleError = (message) => {
  const alertBox = document.getElementById("alert");
  const errorText = document.getElementById("errorMessage1");

  if (!message) {
    alertBox.classList.add("d-none");
    errorText.textContent = "";
  } else {
    errorText.textContent = message;
    alertBox.classList.remove("d-none");
  }
};
