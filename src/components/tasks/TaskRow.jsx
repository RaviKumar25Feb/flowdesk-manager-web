import { FiCalendar } from "react-icons/fi";
import TaskActions from "./TaskActions";

const TaskRow = ({ task, onEditTask, fetchTasks }) => {
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

  const statusDot = {
    TODO: "bg-gray-500",
    IN_PROGRESS: "bg-blue-500",
    IN_REVIEW: "bg-yellow-500",
    COMPLETED: "bg-green-500",
  };

  const formatText = (text) =>
    text
      ?.toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const getRelativeTime = (date) => {
    const now = new Date();
    const updated = new Date(date);

    const diff = Math.floor((now - updated) / 1000);

    if (diff < 60) return "Just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  };

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50">
      {/* Task */}
      <td className="px-4 py-4">
        <div className="min-w-0">
          <h3
            className="truncate text-sm font-semibold text-gray-900"
            title={task.title}
          >
            {task.title}
          </h3>

          <p
            className="mt-1 truncate text-xs text-gray-500"
            title={task.description}
          >
            {task.description || "No description"}
          </p>
        </div>
      </td>

      {/* Project */}
      <td className="px-4 py-4">
        <p
          className="truncate text-sm font-medium text-gray-800"
          title={task.project?.name}
        >
          {task.project?.name || "-"}
        </p>
      </td>

      {/* Assigned To */}
      <td className="px-4 py-4">
        {task.assignedTo ? (
          <div className="flex items-center gap-3">
            {task.assignedTo.profile?.avatar ? (
              <img
                src={task.assignedTo.profile.avatar}
                alt={task.assignedTo.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {task.assignedTo.name.charAt(0).toUpperCase()}
              </div>
            )}

            <span
              className="truncate text-sm font-medium text-gray-700"
              title={task.assignedTo.name}
            >
              {task.assignedTo.name}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )}
      </td>

      {/* Priority */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex w-18 justify-center rounded-full px-2 py-1 text-xs font-semibold ${getPriorityStyle(
            task.priority,
          )}`}
        >
          {formatText(task.priority)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              statusDot[task.status] ?? "bg-gray-400"
            }`}
          />
          {formatText(task.status)}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <FiCalendar className="text-gray-400" />

          <p className="text-sm font-medium text-gray-700">
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "-"}
          </p>
        </div>
      </td>

      {/* Updated */}
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
        {getRelativeTime(task.updatedAt)}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <TaskActions
          task={task}
          onEditTask={onEditTask}
          fetchTasks={fetchTasks}
        />
      </td>
    </tr>
  );
};

export default TaskRow;
