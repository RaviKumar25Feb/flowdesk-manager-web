import api from "../api/axios";

//done
export const getDashboardData = async () => {
  return await api.get("/dashboard");
};
