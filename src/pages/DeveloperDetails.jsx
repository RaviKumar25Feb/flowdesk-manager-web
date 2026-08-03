import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";

import { getDeveloperById } from "../services/developer.service";
import Spinner from "../components/common/Spinner";

const DeveloperDetails = () => {
  const { developerId } = useParams();

  const [developerData, setDeveloperData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDeveloperDetails = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getDeveloperById(developerId);

      setDeveloperData(response.data.data);
    } catch (error) {
      console.error(
        "Fetch Developer Details Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to fetch developer details.",
      );
    } finally {
      setLoading(false);
    }
  }, [developerId]);

  useEffect(() => {
    fetchDeveloperDetails();
  }, [fetchDeveloperDetails]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!developerData) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Developer not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          The developer may not exist or you may not have access.
        </p>

        <Link
          to="/dashboard/developers"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FiArrowLeft />
          Back to Developers
        </Link>
      </div>
    );
  }

  const { user, overview, projects, recentTasks } = developerData;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/dashboard/developers"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to Developers
        </Link>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {user.profile?.avatar ? (
              <img
                src={user.profile.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-gray-600">
                {user.profile?.designation || "Designation not added"}
              </p>

              {user.profile?.department && (
                <p className="mt-1 text-sm text-gray-500">
                  {user.profile.department}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  {user.email}
                </span>

                <span className="inline-flex items-center gap-2">
                  <FiPhone className="text-gray-400" />
                  {user.profile?.phone || "Phone not added"}
                </span>

                <span className="inline-flex items-center gap-2">
                  <FiUser className="text-gray-400" />
                  Joined {joinedDate}
                </span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Edit Account
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Projects"
          value={overview.projectsCount}
          icon={<FiFolder />}
        />

        <StatCard
          title="Assigned Tasks"
          value={overview.assignedTasks}
          icon={<FiBriefcase />}
        />

        <StatCard
          title="Pending"
          value={overview.pendingTasks}
          icon={<FiClock />}
        />

        <StatCard
          title="In Progress"
          value={overview.inProgressTasks}
          icon={<FiBriefcase />}
        />

        <StatCard
          title="Completed"
          value={overview.completedTasks}
          icon={<FiCheckCircle />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AssignedProjects projects={projects} />
        </div>

        <ProfileInformation profile={user.profile} />
      </section>

      <RecentTasks tasks={recentTasks} />
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">{value ?? 0}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

const AssignedProjects = ({ projects }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">Assigned Projects</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Deadline</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {projects?.length ? (
              projects.map((project) => (
                <tr key={project._id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <Link
                      to={`/dashboard/projects/${project._id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {project.name}
                    </Link>
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge priority={project.priority} />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={project.status} />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-5 py-12 text-center text-sm text-gray-500"
                >
                  No projects assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecentTasks = ({ tasks }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">Recent Tasks</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3">Task</th>
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Due Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tasks?.length ? (
              tasks.map((task) => (
                <tr key={task._id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 hover:text-blue-600">
                    <Link to={`/dashboard/tasks/${task._id}`}>
                      {task.title}
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {task.project?.name || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-12 text-center text-sm text-gray-500"
                >
                  No recent tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfileInformation = ({ profile }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-gray-900">Profile Information</h2>

      <div className="mt-5 space-y-4 text-sm">
        <InfoRow
          label="Department"
          value={profile?.department || "Not added"}
        />

        <InfoRow
          label="Designation"
          value={profile?.designation || "Not added"}
        />

        <InfoRow label="City" value={profile?.city || "Not added"} />

        <InfoRow label="State" value={profile?.state || "Not added"} />

        <InfoRow label="Country" value={profile?.country || "Not added"} />
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Skills
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {profile?.skills?.length ? (
            profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No skills added.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
      <span className="text-gray-500">{label}</span>

      <span className="text-right font-medium text-gray-800">{value}</span>
    </div>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[priority] || "bg-gray-100 text-gray-600"
      }`}
    >
      {formatText(priority)}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    TODO: "bg-gray-100 text-gray-700",
    PLANNING: "bg-purple-100 text-purple-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-yellow-100 text-yellow-700",
    TESTING: "bg-indigo-100 text-indigo-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    ON_HOLD: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {formatText(status)}
    </span>
  );
};

const formatText = (text) =>
  text
    ?.toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase()) || "—";

export default DeveloperDetails;
