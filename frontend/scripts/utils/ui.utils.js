export const showError = (message) => {
  const alert = document.getElementById("alert");
  const errorMessage = document.getElementById("errorMessage");

  errorMessage.innerText = message;
  alert.classList.remove("d-none");
};
