import api from "../api/axios";

//done
export const login = (data) => {
  return api.post("/auth/login", data);
};

//done
export const getCurrentUser = () => {
  return api.get("/profile");
};

//done
export const logout = () => {
  return api.post("/auth/logout");
};
