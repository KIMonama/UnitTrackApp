let activeRole = "maintenance";

export const initReportUI = () => {
  console.log("report page initialised");
  const maintenanceTab = document.querySelector('[data-role="maintenance"]');
  const complaintsTab = document.querySelector('[data-role="complaints"]');

  const maintenanceFields = document.getElementById("maintenanceFields");
  const complaintsFields = document.getElementById("complaintsFields");

  if (
    !maintenanceTab ||
    !complaintsTab ||
    !maintenanceFields ||
    !complaintsFields
  ) {
    console.warn("Report UI not initialised: elements missing");
    return;
  }

  const switchRole = (role) => {
    activeRole = role;

    maintenanceTab.classList.toggle("active", role === "maintenance");
    complaintsTab.classList.toggle("active", role === "complaints");

    maintenanceFields.classList.toggle("d-none", role !== "maintenance");
    complaintsFields.classList.toggle("d-none", role !== "complaints");
  };

  maintenanceTab.addEventListener("click", () => switchRole("maintenance"));
  complaintsTab.addEventListener("click", () => switchRole("complaints"));
};

export const getActiveReportRole = () => activeRole;

export const sendWhatsAppReport = () => {
  // 1. Extract values from the form IDs
  const unitName = document.getElementById("unitDetails").innerText; // e.g., Unit 402
  const category = document.getElementById("category").value;
  const desc = document.getElementById("description").value;
  const urgency =
    document.getElementById("urgency").options[
      document.getElementById("urgency").selectedIndex
    ].text;
  const date = document.getElementById("availableDate").value;

  // Complaints logic
  const complaint = document.getElementById("complaintsDescription").value;
  const isComplaint = !document
    .getElementById("complaintsFields")
    .classList.contains("d-none");

  // 2. Get Admin Number from storage
  const adminPhone =
    sessionStorage.getItem("target_admin_phone") || "27XXXXXXXXX";

  // 3. Format the Message (Matching your Admin Share format)
  let message = `🚀 *NEW UNITTRACK REPORT*%0A%0A`;
  message += `📍 *Unit:* ${unitName}%0A`;

  if (isComplaint) {
    message += `📝 *Type:* Complaint/Feedback%0A`;
    message += `💬 *Details:* ${complaint}%0A`;
  } else {
    message += `🛠️ *Category:* ${category}%0A`;
    message += `🚨 *Urgency:* ${urgency}%0A`;
    message += `💬 *Issue:* ${desc}%0A`;
    message += `📅 *Access Date:* ${date}%0A`;
  }

  message += `%0A_Sent via UnitTrack Maintenance Portal_`;

  // 4. Construct URI and Redirect
  const whatsappURI = `whatsapp://send?phone=0814350822&text=${message}`;

  window.location.href = whatsappURI;
};
