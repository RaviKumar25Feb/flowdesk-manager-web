import { useEffect, useState } from "react";

import { getProjects, getArchivedProjects } from "../services/project.service";
import Loader from "../components/common/Loader";

import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectStats from "../components/projects/ProjectStats";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectsTable from "../components/projects/ProjectsTable";
import ProjectFormModal from "../components/projects/ProjectFormModal";
import { useDashboard } from "../context/DashboardContext";

const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");

  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { dashboardData, loadingDashboard } = useDashboard();

  const handleCreate = () => {
    setSelectedProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);

      let response;

      if (status === "ARCHIVED") {
        response = await getArchivedProjects({
          page,
          limit,
          search: search || undefined,
          priority: priority === "ALL" ? undefined : priority,
          sortBy: "updatedAt",
          order: "desc",
        });
      } else {
        response = await getProjects({
          page,
          limit,
          search: search || undefined,
          status: status === "ALL" ? undefined : status,
          priority: priority === "ALL" ? undefined : priority,
          sortBy: "updatedAt",
          order: "desc",
        });
      }

      if (response.data.success) {
        setProjects(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch whenever query changes
  useEffect(() => {
    fetchProjects();
  }, [page, search, status, priority]);

  const handleSearch = (value) => {
    setSearchInput(value);
  };

  const handleStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handlePriority = (value) => {
    setPriority(value);
    setPage(1);
  };

  return (
    <>
      <div className="space-y-5">
        <ProjectsHeader onCreateProject={handleCreate} />

        <ProjectStats
          dashboardData={dashboardData}
          loadingDashData={loadingDashboard}
        />

        <ProjectFilters
          search={searchInput}
          onSearch={handleSearch}
          status={status}
          onStatusChange={handleStatus}
          priority={priority}
          onPriorityChange={handlePriority}
        />

        <ProjectsTable
          projects={projects}
          loading={loading}
          pagination={pagination}
          page={page}
          setPage={setPage}
          onEditProject={handleEdit}
          fetchProjects={fetchProjects}
          status={status}
        />
      </div>

      <ProjectFormModal
        open={isProjectModalOpen}
        onClose={closeProjectModal}
        onSuccess={fetchProjects}
        project={selectedProject}
      />
    </>
  );
};

export default Projects;
