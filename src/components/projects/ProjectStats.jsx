import {
  FiFolder,
  FiPlayCircle,
  FiCheckCircle,
  FiPauseCircle,
  FiXCircle,
} from "react-icons/fi";

import { Trash2 } from "lucide-react";

const ProjectStats = ({ dashboardData }) => {
  const overview = dashboardData?.overview || {};

  const stats = [
    {
      title: "Total Projects",
      value: overview.totalProjects || 0,
      icon: FiFolder,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active",
      value: overview.activeProjects || 0,
      icon: FiPlayCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Completed",
      value: overview.completedProjects || 0,
      icon: FiCheckCircle,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "On Hold",
      value: overview.onHoldProjects || 0,
      icon: FiPauseCircle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Cancelled",
      value: overview.cancelledProjects || 0,
      icon: FiXCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Archived",
      value: overview.archivedProjects || 0,
      icon: Trash2,
      iconBg: "bg-red-100",
      iconColor: "text-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-md border border-gray-100 bg-gray-50 px-5 py-3 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <Icon className={`text-2xl ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectStats;
