import api from "../api/axios";

//done
export const getProjectDiscussions = (projectId) => {
  return api.get(`/projectDiscussion/${projectId}/discussions`);
};

//done
export const createProjectDiscussion = (projectId, data) => {
  return api.post(`/projectDiscussion/${projectId}/discussions`, data);
};

//done
export const updateProjectDiscussion = (commentId, data) => {
  return api.patch(`/projectDiscussion/${commentId}`, data);
};

//done
export const deleteProjectDiscussion = (commentId) => {
  return api.delete(`/projectDiscussion/${commentId}`);
};
