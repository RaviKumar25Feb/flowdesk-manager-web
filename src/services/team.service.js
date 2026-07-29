import api from "../api/axios";

export const assignDevelopers = ({ projectId, developers }) => {
  return api.patch("/team/assign", {
    projectId,
    developers,
  });
};

export const getAssignedDevelopers = (projectId) => {
  return api.get(`/team/${projectId}/developers`);
};

export const getDevelopers = () => {
  return api.get("/users", {
    params: {
      role: "DEVELOPER",
      limit: 1000,
    },
  });
};
