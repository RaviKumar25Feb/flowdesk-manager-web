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

//change password
export const changePassword = (data) => {
  return api.put("/auth/change-password", data);
};

//reset token
export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", {
    email,
  });
};

//reset password
export const resetPassword = (data) => {
  return api.post("/auth/reset-password", data);
};
