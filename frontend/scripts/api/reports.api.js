// api/report.api.js
const BASE_URL = "http://localhost:3000/api/report";

export const updateReportStatus = async (id, status) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update report status");
  }

  return response.json();
};

export const logNewreport = async (payload) => {
  const response = await fetch("http://localhost:3000/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Invalid login credentials");
  }

  return response.json();
};

export const fetchAllReports = async (adminCode) => {
  const response = await fetch(
    `http://localhost:3000/api/reports/${adminCode}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }
  const data = await response.json();
  return data.reports;
};
