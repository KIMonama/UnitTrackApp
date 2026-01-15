export const validateLogin = (role, identifierInput) => {
  console.log("validation hit");

  if (role.selectedIdex === 0) {
    return "Please select a role";
  }

  if (!identifierInput.value.trim()) {
    return "Please enter your code";
  }

  return null; // valid
};
