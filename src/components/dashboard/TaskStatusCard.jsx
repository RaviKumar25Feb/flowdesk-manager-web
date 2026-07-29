const TaskStatusCard = ({ taskStatus }) => {
  const { total, todo, inProgress, inReview, completed } = taskStatus;

  const getPercentage = (value) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const statusList = [
    {
      title: "To Do",
      value: todo,
      color: "bg-gray-500",
    },
    {
      title: "In Progress",
      value: inProgress,
      color: "bg-blue-500",
    },
    {
      title: "In Review",
      value: inReview,
      color: "bg-yellow-500",
    },
    {
      title: "Completed",
      value: completed,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="rounded-md border border-gray-100 bg-gray-50 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Task Status</h2>

          <p className="text-sm text-gray-500">{total} Total Tasks</p>
        </div>
      </div>

      <div className="space-y-5">
        {statusList.map((status) => (
          <div key={status.title}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {status.title}
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {status.value}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full ${status.color}`}
                style={{
                  width: `${getPercentage(status.value)}%`,
                }}
              />
            </div>

            <p className="mt-1 text-xs text-gray-500">
              {getPercentage(status.value)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusCard;
