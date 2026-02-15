const USER_KEY = "currentUser";
const TOKEN_KEY = "authToken"; // Add a key for the token

export const saveCurrentUser = (user, token) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token); // Save the "Key"
  }
};

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearCurrentUser = () => {
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY); // Clear the token on logout
};

export const isAuthenticated = () => {
  // Real authentication checks if the TOKEN exists
  return !!sessionStorage.getItem(TOKEN_KEY);
};
