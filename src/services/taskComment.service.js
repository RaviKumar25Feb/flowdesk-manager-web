import api from "../api/axios";

export const getTaskComments = (taskId) => {
  return api.get(`/taskComment/${taskId}/comments`);
};

export const createTaskComment = (taskId, data) => {
  return api.post(`/taskComment/${taskId}/comments`, data);
};

export const updateTaskComment = (commentId, data) => {
  return api.patch(`/taskComment/${commentId}`, data);
};

export const deleteTaskComment = (commentId) => {
  return api.delete(`/taskComment/${commentId}`);
};
