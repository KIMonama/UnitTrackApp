export const loginUser = async (payload) => {
  console.log("api hit");
  console.log (payload);
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Invalid login credentials");
  }

  return response.json();
};
