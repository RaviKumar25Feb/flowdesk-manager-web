import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";

import { getClientById } from "../services/client.service";
import Spinner from "../components/common/Spinner";

const ClientDetails = () => {
  const { clientId } = useParams();

  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClientDetails = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getClientById(clientId);

      setClientData(response.data.data);
    } catch (error) {
      console.error(
        "Fetch Client Details Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to fetch client details.",
      );
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Client not found
        </h2>

        <Link
          to="/dashboard/clients"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <FiArrowLeft />
          Back to Clients
        </Link>
      </div>
    );
  }

  const { user, overview, projects } = clientData;

  const joinedDate = formatDate(user.createdAt);

  const location = [
    user.profile?.city,
    user.profile?.state,
    user.profile?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/dashboard/clients"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
      >
        <FiArrowLeft />
        Back to Clients
      </Link>

      {/* Client Header */}
      <section className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {user.profile?.avatar ? (
            <img
              src={user.profile.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-purple-100 text-3xl font-bold text-purple-700">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>

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

            <p className="mt-1 text-sm text-gray-500">Client Account</p>

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
      </section>

      {/* Overview Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={overview?.projectsCount}
          icon={<FiFolder />}
        />

        <StatCard
          title="Active Projects"
          value={overview?.activeProjects}
          icon={<FiClock />}
        />

        <StatCard
          title="Completed Projects"
          value={overview?.completedProjects}
          icon={<FiCheckCircle />}
        />

        <StatCard
          title="On Hold Projects"
          value={overview?.onHoldProjects}
          icon={<FiClock />}
        />
      </section>

      {/* Extra Project Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <MiniStatCard title="Planning" value={overview?.planningProjects} />

        <MiniStatCard title="Testing" value={overview?.testingProjects} />

        <MiniStatCard title="Cancelled" value={overview?.cancelledProjects} />
      </section>

      <section className="space-y-6">
        {/* Contact Information */}
        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-gray-900">Contact Information</h2>

            <p className="text-sm text-gray-500">
              Client contact and location details.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ContactRow icon={<FiMail />} label="Email" value={user.email} />

            <ContactRow
              icon={<FiPhone />}
              label="Phone"
              value={user.profile?.phone || "Not added"}
            />

            <ContactRow
              icon={<FiMapPin />}
              label="Location"
              value={location || "Not added"}
            />
          </div>

          {(user.profile?.linkedin ||
            user.profile?.portfolio ||
            user.profile?.github) && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Links
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {user.profile?.linkedin && (
                  <ProfileLink href={user.profile.linkedin} label="LinkedIn" />
                )}

                {user.profile?.portfolio && (
                  <ProfileLink
                    href={user.profile.portfolio}
                    label="Portfolio"
                  />
                )}

                {user.profile?.github && (
                  <ProfileLink href={user.profile.github} label="GitHub" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Projects Table */}
        <ClientProjects projects={projects} />
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
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

const MiniStatCard = ({ title, value }) => {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-1 text-xl font-bold text-gray-900">{value ?? 0}</p>
    </div>
  );
};

const ClientProjects = ({ projects = [] }) => {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">Client Projects</h2>

        <p className="mt-1 text-sm text-gray-500">
          All active projects associated with this client.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Team</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Deadline</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project._id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <Link
                      to={`/dashboard/projects/${project._id}`}
                      className="text-sm font-semibold text-gray-900 transition hover:text-blue-600"
                    >
                      {project.name}
                    </Link>

                    <p className="mt-1 text-xs text-gray-500">
                      Started {formatDate(project.startDate)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <DevelopersPreview developers={project.developers} />
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge priority={project.priority} />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={project.status} />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {formatDate(project.deadline)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-12 text-center text-sm text-gray-500"
                >
                  No projects associated with this client.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DevelopersPreview = ({ developers = [] }) => {
  if (!developers.length) {
    return <span className="text-sm text-gray-500">Not assigned</span>;
  }

  return (
    <div className="flex items-center">
      {developers.slice(0, 3).map((developer, index) => (
        <div
          key={developer._id}
          title={developer.name}
          className={index !== 0 ? "-ml-2" : ""}
        >
          {developer.profile?.avatar ? (
            <img
              src={developer.profile.avatar}
              alt={developer.name}
              className="h-8 w-8 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-xs font-semibold text-white">
              {developer.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}

      {developers.length > 3 && (
        <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-semibold text-gray-600">
          +{developers.length - 3}
        </div>
      )}
    </div>
  );
};

const ContactRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p
          className="mt-1 break-words text-sm font-semibold text-gray-800"
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

const ProfileLink = ({ href, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block truncate text-sm font-medium text-blue-600 hover:underline"
    >
      {label}
    </a>
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
      className={`inline-flex min-w-20 justify-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[priority] || "bg-gray-100 text-gray-600"
      }`}
    >
      {formatText(priority)}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    PLANNING: "bg-purple-100 text-purple-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    TESTING: "bg-indigo-100 text-indigo-700",
    ON_HOLD: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {formatText(status)}
    </span>
  );
};

const formatText = (text) => {
  if (!text) return "—";

  return text
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default ClientDetails;
