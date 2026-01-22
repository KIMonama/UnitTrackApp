const USER_KEY = "currentUser";

export const saveCurrentUser = (user) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearCurrentUser = () => {
  sessionStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem(USER_KEY);
};
