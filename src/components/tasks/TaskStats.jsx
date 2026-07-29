import {
  FiList,
  FiClock,
  FiPlayCircle,
  FiCheckCircle,
  FiCheckSquare,
} from "react-icons/fi";

const TaskStats = ({ overview }) => {
  const stats = [
    {
      title: "Total Tasks",
      value: overview?.total || 0,
      icon: FiList,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Todo",
      value: overview?.todo || 0,
      icon: FiClock,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "In Progress",
      value: overview?.inProgress || 0,
      icon: FiPlayCircle,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "In Review",
      value: overview?.inReview || 0,
      icon: FiCheckSquare,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Completed",
      value: overview?.completed || 0,
      icon: FiCheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
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

export default TaskStats;
