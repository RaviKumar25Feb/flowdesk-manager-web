import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectHeader from "../components/project-details-page/ProjectHeader";
import OverviewCards from "../components/project-details-page/OverviewCards";
import ProjectOverview from "../components/project-details-page/ProjectOverview";
import RecentTasks from "../components/project-details-page/RecentTasks";
import ClientCard from "../components/project-details-page/ClientCard";
import DevelopersCard from "../components/project-details-page/DevelopersCard";
import ProjectDetailsLoading from "../components/project-details-page/ProjectDetailsLoading";
import ProjectComments from "../components/project-details-page/ProjectComments";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { getProjectById } from "../services/project.service";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [overview, setOverview] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

      const response = await getProjectById(projectId);

      const data = response.data.data;

      setProject(data.project);
      setOverview(data.overview);
      setRecentTasks(data.recentTasks || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch project details.",
      );

      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (loading) {
    return <ProjectDetailsLoading />;
  }

  if (!project || !overview) {
    return null;
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/projects")}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={18} />
        Back to Projects
      </button>{" "}
      {/* saprate component */}
      <ProjectHeader
        project={project}
        formatText={formatText}
        PriorityBadge={PriorityBadge}
        HeaderInfo={HeaderInfo}
        formatDate={formatDate}
        StatusBadge={StatusBadge}
      />
      {/* saprate component */}
      <OverviewCards overview={overview} />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* saprate component */}
          <ProjectOverview
            project={project}
            formatText={formatText}
            overview={overview}
            StatItem={StatItem}
            formatDate={formatDate}
            formatDate={formatDate}
          />
          {/* saprate component */}
          <RecentTasks
            tasks={recentTasks}
            StatusBadge={StatusBadge}
            PriorityBadge={PriorityBadge}
            formatDate={formatDate}
          />

          <ProjectComments projectId={projectId} />
        </div>

        <div className="space-y-6">
          {/* saprate component */}
          <ClientCard client={project.client} UserAvatar={UserAvatar} />

          {/* saprate component */}
          <DevelopersCard
            UserAvatar={UserAvatar}
            developers={project.developers || []}
          />
        </div>
      </div>
    </div>
  );
};

const UserAvatar = ({ user }) => {
  const avatar = user?.profile?.avatar;
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={user?.name || "User"}
        className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700">
      {firstLetter}
    </div>
  );
};

const HeaderInfo = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
};

const StatItem = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>

      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  return (
    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
      {formatText(status)}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  return (
    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
      {formatText(priority)}
    </span>
  );
};

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatText = (value) => {
  if (!value) {
    return "Not available";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default ProjectDetails;
