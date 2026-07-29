import { useEffect, useState } from "react";
import Loader from "../components/common/Loader";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import TaskStatusCard from "../components/dashboard/TaskStatusCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import RecentTasks from "../components/dashboard/RecentTasks";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import { useDashboard } from "../context/DashboardContext";

const Dashboard = () => {
  const { dashboardData, loadingDashboard } = useDashboard();

  if (loadingDashboard) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <StatsCards
        overview={dashboardData.overview}
        taskStatus={dashboardData.taskStatus}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TaskStatusCard taskStatus={dashboardData.taskStatus} />
        <UpcomingDeadlines deadlines={dashboardData.upcomingDeadlines} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentProjects projects={dashboardData.recentProjects} />
        <RecentTasks tasks={dashboardData.recentTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
