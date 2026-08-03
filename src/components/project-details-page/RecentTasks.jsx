import { Link } from "react-router-dom";
const RecentTasks = ({ tasks, PriorityBadge, StatusBadge, formatDate }) => {
  return (
    <section className="rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <p className="p-6 text-sm text-gray-500">
          No tasks found for this project.
        </p>
      ) : (
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex flex-col justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-medium text-gray-900 hover:text-blue-500">
                  <Link to={`/dashboard/tasks/${task._id}`}>
                    {task.title}
                  </Link>
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Assigned to: {task.assignedTo?.name || "Not assigned"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />

                <span className="text-xs text-gray-500">
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default RecentTasks;
