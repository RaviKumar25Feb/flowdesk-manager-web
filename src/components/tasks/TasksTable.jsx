import TaskRow from "./TaskRow";
import Pagination from "../common/Pagination";

const TasksTable = ({
  tasks,
  loading,
  pagination,
  page,
  setPage,
  onEditTask,
  fetchTasks,
}) => {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="animate-pulse divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && tasks.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-20 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">No Tasks Found</h3>

        <p className="mt-2 text-sm text-gray-500">
          Try changing your filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-visible rounded-md border border-gray-200 bg-white shadow-sm">
      {/* Table */}
      <div className="sidebar-scroll overflow-x-auto overflow-y-visible rounded-md">
        <table className="min-w-290 w-full table-fixed">
          <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="w-75 px-4 py-4">Task</th>

              <th className="w-45 px-4 py-4">Project</th>

              <th className="w-45 px-4 py-4">Assigned To</th>

              <th className="w-30 px-4 py-4">Priority</th>

              <th className="w-32.5 px-4 py-4">Status</th>

              <th className="w-37.5 px-4 py-4">Due Date</th>

              <th className="w-32.5 px-4 py-4">Updated</th>

              <th className="w-20 px-2 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                onEditTask={onEditTask}
                fetchTasks={fetchTasks}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="rounded-md border-t border-gray-200 bg-white px-6 py-4">
        <Pagination pagination={pagination} page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default TasksTable;
