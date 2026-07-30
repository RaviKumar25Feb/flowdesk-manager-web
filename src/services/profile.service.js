import api from "../api/axios";

export const getProfile = () => {
  return api.get("/profile");
};

export const updateProfile = (data) => {
  return api.put("/profile/update", data);
};

export const updateAvatar = (formData) => {
  return api.patch("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
