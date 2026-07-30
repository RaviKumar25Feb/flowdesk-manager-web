import api from "../api/axios";

//done
export const assignDevelopers = ({ projectId, developers }) => {
  return api.patch("/team/assign", {
    projectId,
    developers,
  });
};

//done
export const getAssignedDevelopers = (projectId) => {
  return api.get(`/team/${projectId}/developers`);
};

//done
export const getDevelopers = () => {
  return api.get("/users", {
    params: {
      role: "DEVELOPER",
      limit: 1000,
    },
  });
};
