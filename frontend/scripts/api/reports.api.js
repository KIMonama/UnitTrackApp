// api/report.api.js
const BASE_URL = "http://localhost:3000/api/reports";
import { getToken } from "../state/session.js";

export const updateReportStatus = async (id, status) => {
  console.log("update front end hit")
  const token = getToken();

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH", // Changed to PATCH as we are only updating 'status'
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 Send the token here too!
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update report status");
  }

  return response.json();
};

export const logNewreport = async (payload) => {
  const token = getToken();

  if (!token) window.location.href = "index.html";

  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to log a new report at this time. Please try again later."
    );
  }

  return response.json();
};

export const fetchAllReports = async () => {
  const token = getToken(); // Get the secure key

  const response = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // 🔥 Essential for the backend to filter data
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }
  const data = await response.json();
  return data.reports;
};
