import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiUser,
  FiAlertCircle,
  FiCalendar,
} from "react-icons/fi";

const RecentTasks = ({ tasks }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";

      case "HIGH":
        return "bg-orange-100 text-orange-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "IN_REVIEW":
        return "bg-purple-100 text-purple-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatText = (text) =>
    text
      ?.toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const getDueLabel = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diff === 0)
      return {
        text: "Due Today",
        color: "text-red-600",
      };

    if (diff === 1)
      return {
        text: "Due Tomorrow",
        color: "text-orange-600",
      };

    if (diff > 1)
      return {
        text: `Due in ${diff} days`,
        color: "text-blue-600",
      };

    return {
      text: `Overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""}`,
      color: "text-red-600",
    };
  };

  return (
    <div className="flex h-130 flex-col rounded-md border border-gray-100 bg-gray-50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>

          <p className="text-sm text-gray-500">Recently updated tasks</p>
        </div>

        <Link
          to="/dashboard/tasks"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
          <FiArrowRight />
        </Link>
      </div>

      {/* Body */}

      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6 py-5">
          <div className="flex flex-col items-center">
            <FiAlertCircle className="mb-3 text-5xl text-gray-300" />
            <p className="font-medium text-gray-700">No Recent Tasks</p>
            <p className="mt-1 text-sm text-gray-500">
              Tasks will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="
                flex-1
                overflow-y-auto
                scrollbar-thin
                scrollbar-thumb-gray-300
                scrollbar-track-transparent
                hover:scrollbar-thumb-gray-400
            "
        >
          {tasks.map((task, index) => {
            const due = getDueLabel(task.dueDate);

            return (
              <div
                key={task._id}
                className={`px-6 py-5 transition-all duration-200 hover:bg-gray-50 ${
                  index !== tasks.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                {/* Title */}

                <h3 className="truncate text-base font-semibold text-gray-900 hover:text-blue-500">
                  <Link to={`/dashboard/tasks/${task._id}`}>
                    {task.title}
                  </Link>
                </h3>

                {/* Project */}

                <p className="mt-1 text-sm text-gray-500">
                  {task.project?.name || "-"}
                </p>

                {/* Assignee + Due */}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {task.assignedTo?.profile?.avatar ? (
                      <img
                        src={task.assignedTo.profile.avatar}
                        alt={task.assignedTo.name}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                        {task.assignedTo?.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "-"}
                      </div>
                    )}

                    <span className="text-sm text-gray-600">
                      {task.assignedTo?.name || "-"}
                    </span>
                  </div>

                  <p className={`text-sm font-medium ${due.color}`}>
                    {due.text}
                  </p>
                </div>

                {/* Priority + Status */}

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                      task.priority,
                    )}`}
                  >
                    {formatText(task.priority)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      task.status,
                    )}`}
                  >
                    {formatText(task.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTasks;
