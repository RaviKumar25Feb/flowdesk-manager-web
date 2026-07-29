import { createContext, useContext, useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboard.service";
import { useAuth } from "./AuthContext";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const { user, loading } = useAuth();

  const refreshDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const response = await getDashboardData();

      if (response.data.success) {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    refreshDashboard();
  }, [loading, user]);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        loadingDashboard,
        refreshDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  return useContext(DashboardContext);
};
