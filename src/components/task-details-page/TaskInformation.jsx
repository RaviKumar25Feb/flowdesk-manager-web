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

const TaskInformation = ({ task, isOverdue, InfoItem }) => {
  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          Task Information
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Schedule, work hours and progress information
        </p>
      </div>

      <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <InfoItem
          icon={<CalendarDays size={18} />}
          label="Due Date"
          value={formatDate(task.dueDate)}
          danger={isOverdue}
        />

        <InfoItem
          icon={<Clock3 size={18} />}
          label="Estimated Hours"
          value={formatHours(task.estimatedHours, "Not specified")}
        />

        <InfoItem
          icon={<Clock3 size={18} />}
          label="Actual Hours"
          value={formatHours(task.actualHours, "Not recorded")}
        />

        <InfoItem
          icon={<CalendarDays size={18} />}
          label="Created On"
          value={formatDate(task.createdAt)}
        />

        <InfoItem
          icon={<CalendarDays size={18} />}
          label="Last Updated"
          value={formatDate(task.updatedAt)}
        />

        {task.completedAt && (
          <InfoItem
            icon={<CheckCircle2 size={18} />}
            label="Completed On"
            value={formatDate(task.completedAt)}
          />
        )}
      </div>
    </section>
  );
};

export default TaskInformation;
