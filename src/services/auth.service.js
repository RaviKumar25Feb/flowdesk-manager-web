import api from "../api/axios";

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const getCurrentUser = () => {
  return api.get("/profile");
};

export const logout = () => {
  return api.post("/auth/logout");
};
