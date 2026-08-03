import api from "../api/axios";

// Get developers list
export const getDevelopers = (params = {}) => {
  return api.get("/users", {
    params: {
      ...params,
      role: "DEVELOPER",
    },
  });
};

// Get single developer details
export const getDeveloperById = (developerId) => {
  return api.get(`/users/${developerId}`);
};

// Create developer account
export const createDeveloper = (data) => {
  return api.post("/users", {
    ...data,
    role: "DEVELOPER",
  });
};

// Update developer account
export const updateDeveloper = (developerId, data) => {
  return api.patch(`/users/${developerId}/update`, data);
};

// Deactivate developer account
export const deactivateDeveloper = (developerId) => {
  return api.patch(`/users/${developerId}/deactivate`);
};

// Activate developer account
export const activateDeveloper = (developerId) => {
  return api.patch(`/users/${developerId}/activate`);
};

// Developer Overview
export const getDevelopersOverview = () => {
  return api.get("/users/developers/overview");
};
