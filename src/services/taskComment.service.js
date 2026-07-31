import api from "../api/axios";

//done
export const getTaskComments = (taskId) => {
  return api.get(`/taskDiscussion/${taskId}/discussions`);
};

//done
export const createTaskComment = (taskId, data) => {
  return api.post(`/taskDiscussion/${taskId}/discussions`, data);
};

//done
export const updateTaskComment = (commentId, data) => {
  return api.patch(`/taskDiscussion/${commentId}`, data);
};

//done
export const deleteTaskComment = (commentId) => {
  return api.delete(`/taskDiscussion/${commentId}`);
};
