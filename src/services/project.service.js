import api from "../api/axios";

export const getProjects = (params) => {
  return api.get("/projects", { params });
};

export const getProjectOptions = () => {
  return api.get("/projects/options");
};

export const createProject = (data) => {
  return api.post("/projects", data);
};

export const getClients = () => {
  return api.get("/users", {
    params: {
      role: "CLIENT",
      limit: 1000,
    },
  });
};

export const updateProject = (projectId, data) => {
  return api.put(`/projects/${projectId}`, data);
};

export const archiveProject = (projectId) => {
  return api.patch(`/projects/${projectId}`);
};

export const restoreProject = (projectId) => {
  return api.patch(`/projects/${projectId}/restore`);
};

export const getArchivedProjects = (params) => {
  return api.get("/projects/archived", { params });
};

export const assignDevelopers = (projectId, developers) => {
  return api.patch(`/projects/${projectId}/assign`, {
    developers,
  });
};

export const getProjectById = (projectId) => {
  return api.get(`/projects/${projectId}`);
};
