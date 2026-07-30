import api from "../api/axios";

//done
export const getTaskComments = (taskId) => {
  return api.get(`/taskComment/${taskId}/comments`);
};

//done
export const createTaskComment = (taskId, data) => {
  return api.post(`/taskComment/${taskId}/comments`, data);
};

//done
export const updateTaskComment = (commentId, data) => {
  return api.patch(`/taskComment/${commentId}`, data);
};

//done
export const deleteTaskComment = (commentId) => {
  return api.delete(`/taskComment/${commentId}`);
};
