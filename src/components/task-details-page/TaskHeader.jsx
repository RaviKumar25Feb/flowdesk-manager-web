import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Mail,
  MessageSquareText,
  Pencil,
  Send,
  UserRound,
} from "lucide-react";

import {
  formatDate,
  formatDateTime,
  formatHours,
  formatText,
} from "./commonFunctions";

const TaskHeader = ({
  task,
  HeaderStat,
  isOverdue,
  onEdit,
  PriorityBadge,
  StatusBadge,
}) => {
  return (
    <section className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-gray-500">Task Details</p>

              {isOverdue && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                  <AlertCircle size={13} />
                  Overdue
                </span>
              )}
            </div>

            <h1 className="mt-2 wrap-break-word text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              {task.title}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Created {formatDate(task.createdAt)}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="cursor-pointer inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Pencil size={16} />
            Edit Task
          </button>
        </div>
      </div>

      <div className="grid divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        <HeaderStat
          label="Status"
          value={formatText(task.status)}
          icon={<CheckCircle2 size={18} />}
        />

        <HeaderStat
          label="Priority"
          value={formatText(task.priority)}
          icon={<AlertCircle size={18} />}
        />

        <HeaderStat
          label="Due Date"
          value={formatDate(task.dueDate)}
          icon={<CalendarDays size={18} />}
          danger={isOverdue}
        />

        <HeaderStat
          label="Estimated Time"
          value={formatHours(task.estimatedHours, "Not specified")}
          icon={<Clock3 size={18} />}
        />
      </div>
    </section>
  );
};
export default TaskHeader;
