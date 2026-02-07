export function showStep(stepNum) {
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step" + stepNum).classList.add("active");
}

export function initStepUI() {
  // default step
  showStep(1);
}
