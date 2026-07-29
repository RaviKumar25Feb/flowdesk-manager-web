import api from "../api/axios";

//done
export const getProjects = (params) => {
  return api.get("/projects", { params });
};

//done
export const getProjectOptions = () => {
  return api.get("/projects/options");
};

//done
export const createProject = (data) => {
  return api.post("/projects", data);
};

//done
export const getClients = () => {
  return api.get("/users", {
    params: {
      role: "CLIENT",
      limit: 1000,
    },
  });
};

//done
export const updateProject = (projectId, data) => {
  return api.put(`/projects/${projectId}`, data);
};

//done
export const archiveProject = (projectId) => {
  return api.patch(`/projects/${projectId}`);
};

//done
export const restoreProject = (projectId) => {
  return api.patch(`/projects/${projectId}/restore`);
};

//done
export const getArchivedProjects = (params) => {
  return api.get("/projects/archived", { params });
};

//done
export const assignDevelopers = (projectId, developers) => {
  return api.patch(`/projects/${projectId}/assign`, {
    developers,
  });
};

//done
export const getProjectById = (projectId) => {
  return api.get(`/projects/${projectId}`);
};
