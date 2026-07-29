import api from "../api/axios";

//done
export const getTasks = (params) => {
  return api.get("/tasks", {
    params,
  });
};

//done
export const getTaskById = (taskId) => {
  return api.get(`/tasks/${taskId}`);
};

//done
export const createTask = (data) => {
  return api.post("/tasks", data);
};

//done
export const updateTask = (taskId, data) => {
  return api.put(`/tasks/${taskId}`, data);
};

//done
export const deleteTask = (taskId) => {
  return api.delete(`/tasks/${taskId}`);
};
