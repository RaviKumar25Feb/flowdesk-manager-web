import { useEffect, useState } from "react";

import { getTasks } from "../services/task.service";
import { getProjectOptions } from "../services/project.service";
import { useDashboard } from "../context/DashboardContext";

import TasksHeader from "../components/tasks/TasksHeader";
import TaskStats from "../components/tasks/TaskStats";
import TaskFilters from "../components/tasks/TaskFilters";
import TasksTable from "../components/tasks/TasksTable";
import TaskRow from "../components/tasks/TaskRow";
import TaskFormModal from "../components/tasks/TaskFormModal";

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const [overview, setOverview] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [project, setProject] = useState("ALL");
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");

  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const { refreshDashboard } = useDashboard();

  const handleCreate = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(false);
  };

  const fetchProjectOptions = async () => {
    try {
      const response = await getProjectOptions();

      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  useEffect(() => {
    fetchProjectOptions();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await getTasks({
        page,
        limit,
        search: search || undefined,
        project: project === "ALL" ? undefined : project,
        status: status === "ALL" ? undefined : status,
        priority: priority === "ALL" ? undefined : priority,
        sortBy: "updatedAt",
        order: "desc",
      });

      if (response.data.success) {
        setOverview(response.data.overview);
        setTasks(response.data.tasks);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Tasks
  useEffect(() => {
    fetchTasks();
  }, [page, search, project, status, priority]);

  const handleSearch = (value) => {
    setSearchInput(value);
  };

  const handleProject = (value) => {
    setProject(value);
    setPage(1);
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
        <TasksHeader onCreateTask={handleCreate} />

        <TaskStats overview={overview} loading={loading} />

        <TaskFilters
          search={searchInput}
          onSearch={handleSearch}
          project={project}
          projects={projects}
          onProjectChange={handleProject}
          status={status}
          onStatusChange={handleStatus}
          priority={priority}
          onPriorityChange={handlePriority}
        />

        <TasksTable
          tasks={tasks}
          loading={loading}
          pagination={pagination}
          page={page}
          setPage={setPage}
          onEditTask={handleEdit}
          fetchTasks={fetchTasks}
        />
      </div>

      <TaskFormModal
        open={isTaskModalOpen}
        onClose={closeTaskModal}
        onSuccess={async () => {
          await fetchTasks();
          await refreshDashboard();
        }}
        task={selectedTask}
      />
    </>
  );
};

export default Tasks;
