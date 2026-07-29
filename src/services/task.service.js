import api from "../api/axios";

export const getTasks = (params) => {
  return api.get("/tasks", {
    params,
  });
};

export const getTaskById = (taskId) => {
  return api.get(`/tasks/${taskId}`);
};

export const createTask = (data) => {
  return api.post("/tasks", data);
};

export const updateTask = (taskId, data) => {
  return api.put(`/tasks/${taskId}`, data);
};

export const deleteTask = (taskId) => {
  return api.delete(`/tasks/${taskId}`);
};
