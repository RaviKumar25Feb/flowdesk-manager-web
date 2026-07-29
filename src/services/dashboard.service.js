import api from "../api/axios";

export const getDashboardData = async () => {
  return await api.get("/dashboard");
};
