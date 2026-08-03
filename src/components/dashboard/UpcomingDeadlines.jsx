import { FiAlertCircle, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";

const UpcomingDeadlines = ({ deadlines }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-600";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-600";

      case "LOW":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getDueLabel = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffInDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return {
        text: "Due Today",
        className: "text-red-600",
      };
    }

    if (diffInDays === 1) {
      return {
        text: "Due Tomorrow",
        className: "text-orange-600",
      };
    }

    if (diffInDays > 1) {
      return {
        text: `Due in ${diffInDays} days`,
        className: "text-blue-600",
      };
    }

    if (diffInDays === -1) {
      return {
        text: "Overdue by 1 day",
        className: "text-red-600",
      };
    }

    return {
      text: `Overdue by ${Math.abs(diffInDays)} days`,
      className: "text-red-600",
    };
  };

  return (
    <div className="flex h-130 flex-col rounded-md border border-gray-100 bg-gray-50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Deadlines
          </h2>

          <p className="text-sm text-gray-500">Tasks requiring attention</p>
        </div>

        <FiCalendar className="text-xl text-gray-400" />
      </div>

      {/* Empty State */}
      {deadlines?.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6 py-5">
          <div className="flex flex-col items-center">
            <FiAlertCircle className="mb-3 text-5xl text-gray-300" />

            <p className="font-medium text-gray-700">No upcoming deadlines</p>

            <p className="mt-1 text-sm text-gray-500">Everything is on track</p>
          </div>
        </div>
      ) : (
        <div
          className="flex-1
            overflow-y-auto
            px-6
            py-5
            space-y-4
            scrollbar-thin
            scrollbar-thumb-gray-300
            scrollbar-track-transparent
            hover:scrollbar-thumb-gray-400"
        >
          {deadlines.map((task) => {
            const due = getDueLabel(task.dueDate);

            return (
              <div
                key={task._id}
                className="rounded-md border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900 hover:text-blue-500">
                      <Link to={`/dashboard/tasks/${task._id}`}>
                        {task.title}
                      </Link>
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {task.project?.name}
                    </p>

                    <p className={`mt-3 text-sm font-medium ${due.className}`}>
                      {due.text}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Priority */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
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

export default UpcomingDeadlines;
