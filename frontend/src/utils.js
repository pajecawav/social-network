export const getLocalToken = () => localStorage.getItem("token");

export const saveLocalToken = (token) => localStorage.setItem("token", token);

export const deleteLocalToken = () => localStorage.removeItem("token");
