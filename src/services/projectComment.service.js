import api from "../api/axios";

export const getProjectDiscussions = (projectId) => {
  return api.get(`/projectDiscussion/${projectId}/discussions`);
};

export const createProjectDiscussion = (projectId, data) => {
  return api.post(`/projectDiscussion/${projectId}/discussions`, data);
};

export const updateProjectDiscussion = (commentId, data) => {
  return api.patch(`/projectDiscussion/${commentId}`, data);
};

export const deleteProjectDiscussion = (commentId) => {
  return api.delete(`/projectDiscussion/${commentId}`);
};