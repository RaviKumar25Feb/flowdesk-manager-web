import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskComments from "../components/task-details-page/TaskComments";
import PageBackButton from "../components/task-details-page/PageBackButton";
import TaskHeader from "../components/task-details-page/TaskHeader";
import TaskDescription from "../components/task-details-page/TaskDescription";
import TaskInformation from "../components/task-details-page/TaskInformation";

import {
  formatDate,
  formatDateTime,
  formatHours,
  formatText,
} from "../components/task-details-page/commonFunctions";

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
import { toast } from "sonner";

import { getTaskById } from "../services/task.service";

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);

      const response = await getTaskById(taskId);

      setTask(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch task details",
      );

      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const handleEditTask = () => {
    toast.info("Edit Task modal will be connected next.");
  };

  if (loading) {
    return <TaskDetailsSkeleton />;
  }

  if (!task) {
    return <TaskNotFound onBack={() => navigate("/dashboard/tasks")} />;
  }

  const isOverdue =
    task.status !== "COMPLETED" &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      {/* saprate component */}
      <PageBackButton ArrowLeft={ArrowLeft} onClick={() => navigate(-1)} />

      {/* saprate component */}
      <TaskHeader
        task={task}
        isOverdue={isOverdue}
        onEdit={handleEditTask}
        StatusBadge={StatusBadge}
        PriorityBadge={PriorityBadge}
        HeaderStat={HeaderStat}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {/* saprate component */}
          <TaskDescription description={task.description} InfoItem={InfoItem} />

          {/* saprate component */}
          <TaskInformation
            InfoItem={InfoItem}
            task={task}
            isOverdue={isOverdue}
          />

          <TaskComments taskId={task._id} />
        </div>

        <div className="space-y-5 xl:sticky xl:top-5">
          <ProjectCard
            project={task.project}
            onViewProject={() =>
              navigate(`/dashboard/projects/${task.project?._id}`)
            }
          />

          <AssignedDeveloperCard developer={task.assignedTo} />

          <CreatedByCard user={task.createdBy} />
        </div>
      </div>
    </div>
  );
};

const HeaderStat = ({ label, value, icon, danger = false }) => {
  return (
    <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          danger ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p
          className={`mt-1 truncate text-sm font-semibold ${
            danger ? "text-red-600" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, secondaryValue, danger = false }) => {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          danger ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p
          className={`mt-1 wrap-break-word text-sm font-semibold ${
            danger ? "text-red-600" : "text-gray-900"
          }`}
        >
          {hasValue ? value : "Not available"}
        </p>

        {secondaryValue && (
          <p className="mt-1 wrap-break-word text-xs text-gray-500">
            {secondaryValue}
          </p>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onViewProject }) => {
  return (
    <aside className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FolderKanban size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">
            Associated Project
          </p>

          <h3 className="mt-0.5 truncate text-sm font-semibold text-gray-900">
            {project?.name || "Project not available"}
          </h3>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
        {project?.description || "No project description available."}
      </p>

      <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
        <SidebarInfo
          label="Status"
          value={<StatusBadge status={project?.status} />}
        />

        <SidebarInfo
          label="Priority"
          value={<PriorityBadge priority={project?.priority} />}
        />

        <SidebarInfo
          label="Project Start"
          value={formatDate(project?.startDate)}
        />

        <SidebarInfo
          label="Project Deadline"
          value={formatDate(project?.deadline)}
        />
      </div>

      {project?._id && (
        <button
          type="button"
          onClick={onViewProject}
          className="cursor-pointer mt-5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          View Project
        </button>
      )}
    </aside>
  );
};

const AssignedDeveloperCard = ({ developer }) => {
  const firstLetter = developer?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <aside className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Assigned Developer</p>

      <div className="mt-4 flex items-center gap-3">
        {developer?.avatar ? (
          <img
            src={developer.avatar}
            alt={developer.name || "Assigned developer"}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-base font-bold text-gray-700">
            {firstLetter}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {developer?.name || "Not assigned"}
          </p>

          {developer?.email && (
            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
              <Mail size={13} className="shrink-0" />

              <span className="truncate">{developer.email}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const CreatedByCard = ({ user }) => {
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <aside className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Created By</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
          {firstLetter}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user?.name || "Not available"}
          </p>

          {user?.email && (
            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
              <Mail size={13} className="shrink-0" />

              <span className="truncate">{user.email}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const SidebarInfo = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-medium text-gray-500">{label}</span>

      <div className="text-right text-sm font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
        status,
      )}`}
    >
      {formatText(status)}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
        priority,
      )}`}
    >
      {formatText(priority)}
    </span>
  );
};

const TaskNotFound = ({ onBack }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircle size={25} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        Task not found
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        The requested task may have been removed or is unavailable.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        Back to Tasks
      </button>
    </div>
  );
};

const TaskDetailsSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse space-y-5">
      <div className="h-5 w-28 rounded bg-gray-200" />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="p-6">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="mt-3 h-8 w-2/3 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-32 rounded bg-gray-200" />

          <div className="mt-5 flex gap-2">
            <div className="h-6 w-24 rounded-full bg-gray-200" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </div>
        </div>

        <div className="grid border-t border-gray-100 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-gray-100 p-5"
            >
              <div className="h-10 w-10 rounded-xl bg-gray-200" />

              <div>
                <div className="h-3 w-16 rounded bg-gray-200" />
                <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="mt-5 h-24 rounded-xl bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-48 rounded-2xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  const styles = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

const getPriorityStyle = (priority) => {
  const styles = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

  return styles[priority] || "bg-gray-100 text-gray-700";
};

export default TaskDetailsPage;
