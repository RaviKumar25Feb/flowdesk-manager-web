import { Link } from "react-router-dom";
import { FiFolder, FiArrowRight, FiClock, FiBriefcase } from "react-icons/fi";

const RecentProjects = ({ projects }) => {
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

  const formatStatus = (status) =>
    status
      ?.toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

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
    <div className="flex h-130 flex-col rounded-md border border-gray-100 bg-gray-50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Projects
          </h2>

          <p className="text-sm text-gray-500">Latest updated projects</p>
        </div>

        <Link
          to="/dashboard/projects"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          View All
          <FiArrowRight />
        </Link>
      </div>

      {/* Empty State */}
      {projects?.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6 py-5">
          <div className="flex flex-col items-center">
            <FiFolder className="mx-auto mb-3 text-5xl text-gray-300" />

            <p className="font-medium text-gray-700">No Projects Found</p>

            <p className="mt-1 text-sm text-gray-500">
              Projects will appear here once created.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex-1
            overflow-y-auto
            scrollbar-thin
            scrollbar-thumb-gray-300
            scrollbar-track-transparent
            hover:scrollbar-thumb-gray-400"
        >
          {projects.map((project, index) => (
            <div
              key={project._id}
              className={`px-6 py-5 transition-all duration-200 hover:bg-gray-50 ${
                index !== projects.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <FiFolder className="text-lg text-blue-600" />
                    </div>

                    <h3 className="truncate font-semibold text-gray-900">
                      {project.name}
                    </h3>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <FiBriefcase />
                      <span>{project.client?.name || "No Client"}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <FiClock />
                      <span>{getRelativeTime(project.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${getStatusStyle(
                    project.status,
                  )}`}
                >
                  {formatStatus(project.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
