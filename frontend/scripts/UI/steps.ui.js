export function showStep(stepNum) {
  // 1. Select all elements with the 'signup-card' class
  const steps = document.querySelectorAll(".signup-card");

  // 2. Hide all steps and remove active state
  steps.forEach((step) => {
    step.classList.add("d-none");
    step.classList.remove("active");
  });

  // 3. Show the target step
  const targetStep = document.getElementById("step" + stepNum);
  if (targetStep) {
    targetStep.classList.remove("d-none");
    // Add a small delay to trigger CSS animations if you have them
    setTimeout(() => {
      targetStep.classList.add("active");
    }, 10);
  }
}

export function initStepUI() {
  // Initialize the flow at step 1
  showStep(1);
}
export function updateStepper(change) {
  const input = document.getElementById("propCountSelector");
  let currentValue = parseInt(input.value);
  let newValue = currentValue + change;

  // Keep it between 1 and 10
  if (newValue >= 1 && newValue <= 10) {
    input.value = newValue;

    // CRITICAL: This line triggers your old "dynamicPropsContainer" logic
    input.dispatchEvent(new Event("change"));
  }
}
