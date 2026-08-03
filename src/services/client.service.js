import api from "../api/axios";

export const getClients = (params = {}) => {
  return api.get("/users", {
    params: {
      ...params,
      role: "CLIENT",
    },
  });
};

export const getClientById = (clientId) => {
  return api.get(`/users/${clientId}`);
};

export const createClient = (data) => {
  return api.post("/users", {
    ...data,
    role: "CLIENT",
  });
};

export const updateClient = (clientId, data) => {
  return api.patch(`/users/${clientId}/update`, data);
};

export const deactivateClient = (clientId) => {
  return api.patch(`/users/${clientId}/deactivate`);
};

export const activateClient = (clientId) => {
  return api.patch(`/users/${clientId}/activate`);
};

export const getClientsOverview = () => {
  return api.get("/users/clients/overview");
};
