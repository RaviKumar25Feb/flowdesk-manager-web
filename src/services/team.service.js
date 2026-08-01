import api from "../api/axios";

//manager assign developer
export const assignDevelopers = ({ projectId, developers }) => {
  return api.patch("/team/assign", {
    projectId,
    developers,
  });
};

//manager get assigned developers
export const getAssignedDevelopers = (projectId) => {
  return api.get(`/team/${projectId}/developers`);
};

//manager get all developers
export const getAvailableDevelopers = () => {
  return api.get("/users", {
    params: {
      role: "DEVELOPER",
      isActive: true,
      limit: 1000,
      sortBy: "name",
      order: "asc",
    },
  });
};
