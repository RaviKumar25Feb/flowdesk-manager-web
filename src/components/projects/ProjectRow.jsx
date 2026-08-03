import { FiFolder, FiCalendar } from "react-icons/fi";
import ProjectActions from "./ProjectActions";
import { Link } from "react-router-dom";

const ProjectRow = ({ project, onEditProject, fetchProjects, status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-700";
      case "PLANNING":
        return "bg-purple-100 text-purple-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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
    IN_PROGRESS: "bg-blue-500",
    COMPLETED: "bg-green-500",
    ON_HOLD: "bg-yellow-500",
    PLANNING: "bg-purple-500",
    CANCELLED: "bg-red-500",
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 55) return "bg-blue-500";
    if (progress <= 55 && progress >= 30) return "bg-orange-400";
    return "bg-red-400";
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

  const getDeadlineLabel = (deadline) => {
    const today = new Date();
    const due = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diff === 0) return { text: "Today", color: "text-red-600" };

    if (diff === 1) return { text: "Tomorrow", color: "text-orange-600" };

    if (diff > 1) return { text: `${diff} days`, color: "text-blue-600" };

    return {
      text: `${Math.abs(diff)} days overdue`,
      color: "text-red-600",
    };
  };

  const deadline = getDeadlineLabel(project.deadline);

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50">
      {/* Project */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 font-semibold text-blue-700">
            {project.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900 hover:text-blue-500">
              <Link to={`/dashboard/projects/${project._id}`}>
                {project.name}
              </Link>
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {project.completedTasks}/{project.totalTasks} Tasks Completed
            </p>
          </div>
        </div>
      </td>

      {/* Client */}
      <td className="px-4 py-4">
        <p
          className="truncate text-sm font-medium text-gray-800"
          title={project.client?.name || "-"}
        >
          {project.client?.name || "-"}
        </p>
      </td>

      {/* Team */}
      <td className="px-4 py-4">
        <div className="flex">
          {project.developersPreview.slice(0, 3).map((developer, index) => (
            <div
              key={developer._id}
              className={`${index !== 0 ? "-ml-2" : ""}`}
            >
              {developer.profile?.avatar ? (
                <img
                  src={developer.profile.avatar}
                  alt={developer.name}
                  title={developer.name}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div
                  title={developer.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-xs font-semibold text-white"
                >
                  {developer.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {project.developersCount > 3 && (
            <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-semibold text-gray-600">
              +{project.developersCount - 3}
            </div>
          )}
        </div>
      </td>

      {/* Progress */}
      <td className="px-4 py-4">
        <div className="w-32">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>{project.progress}%</span>
          </div>

          <div className="h-2 rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${getProgressColor(project.progress)}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </td>

      {/* Priority */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex w-18 justify-center rounded-full px-1 py-1 text-xs font-semibold ${getPriorityStyle(
            project.priority,
          )}`}
        >
          {formatText(project.priority)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
          <span
            className={`h-2.5 w-2.5 rounded-full ${statusDot[project.status] ?? "bg-gray-400"}`}
          />
          {formatText(project.status)}
        </span>
      </td>

      {/* Deadline */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <FiCalendar className="text-gray-400" />

          <div>
            <p className="text-sm font-medium text-gray-700">
              {new Date(project.deadline).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>
      </td>

      {/* Updated */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {getRelativeTime(project.updatedAt)}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <ProjectActions
          project={project}
          onEditProject={onEditProject}
          fetchProjects={fetchProjects}
          isArchivedView={status === "ARCHIVED"}
        />
      </td>
    </tr>
  );
};

export default ProjectRow;
