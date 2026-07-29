import { FiFolder, FiCheckSquare, FiUsers, FiBriefcase } from "react-icons/fi";

import StatsCard from "./StatsCard";

const StatsCards = ({ overview, taskStatus }) => {
  const cards = [
    {
      title: "Projects",
      value: overview.totalProjects,
      subtitle: `${overview.activeProjects} Active • ${overview.onHoldProjects} On Hold`,
      icon: FiFolder,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Tasks",
      value: overview.totalTasks,
      subtitle: `${taskStatus.completed} Completed`,
      icon: FiCheckSquare,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Developers",
      value: overview.totalDevelopers,
      subtitle: "Team Members",
      icon: FiUsers,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Clients",
      value: overview.totalClients,
      subtitle: "Active Clients",
      icon: FiBriefcase,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
