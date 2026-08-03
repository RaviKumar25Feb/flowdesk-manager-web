import { useEffect, useState } from "react";
import { createTask, updateTask } from "../../services/task.service";
import { getProjectOptions } from "../../services/project.service";
import { getAssignedDevelopers } from "../../services/team.service";
import { toast } from "sonner";

const initialFormData = {
  project: "",
  title: "",
  description: "",
  priority: "MEDIUM",
  assignedTo: "",
  estimatedHours: "",
  dueDate: "",
};

const TaskFormModal = ({ open, onClose, onSuccess, task }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [loadingDevelopers, setLoadingDevelopers] = useState(false);

  const isEdit = Boolean(task);

  //for pre insert data of current task in the form
  useEffect(() => {
    if (!open) return;

    if (task) {
      setFormData({
        project: task.project?._id || task.project || "",
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "MEDIUM",
        assignedTo: task.assignedTo?._id || task.assignedTo || "",
        estimatedHours: task.estimatedHours || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
    } else {
      setFormData(initialFormData);
    }

    setError("");
  }, [open, task]);

  //for getting projects name
  useEffect(() => {
    if (!open) return;

    const fetchProjectOptions = async () => {
      try {
        setLoadingProjects(true);

        const response = await getProjectOptions();

        setProjects(response.data.data || []);
      } catch (error) {
        setProjects([]);

        setError(error.response?.data?.message || "Failed to load projects.");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjectOptions();
  }, [open]);

  //for searching project name while selecting project
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase()),
  );

  //fet getting assigned developers after selecting project
  useEffect(() => {
    if (!open || !formData.project) {
      setDevelopers([]);
      return;
    }

    const fetchProjectDevelopers = async () => {
      try {
        setLoadingDevelopers(true);

        const response = await getAssignedDevelopers(formData.project);

        setDevelopers(response.data.data || []);
      } catch (error) {
        setDevelopers([]);

        setError(
          error.response?.data?.message || "Failed to load project developers.",
        );
      } finally {
        setLoadingDevelopers(false);
      }
    };

    fetchProjectDevelopers();
  }, [open, formData.project]);

  //for getting form data
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "project" && {
        assignedTo: "",
      }),
    }));
  };

  //for handling submit data
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.project || !formData.title.trim() || !formData.dueDate) {
      setError("Project, title and due date are required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignedTo: formData.assignedTo || null,
        estimatedHours: formData.estimatedHours
          ? Number(formData.estimatedHours)
          : undefined,
      };

      if (isEdit) {
        await updateTask(task._id, payload);
        toast.success("Task updated successfully.");
      } else {
        await createTask(payload);
        toast.success("Task created successfully.");
      }

      await onSuccess?.();
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} task.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Task" : "Create Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="cursor-pointer rounded-md p-2 font-bold text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="max-h-[calc(90vh-60px)] overflow-y-auto sidebar-scroll">
          <form onSubmit={handleSubmit} className="space-y-3 px-6 py-2">
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project <span className="text-red-500">*</span>
              </label>

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                disabled={loadingProjects || submitting}
                className="cursor-pointer w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">
                  {loadingProjects ? "Loading projects..." : "Select Project"}
                </option>

                {filteredProjects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter task description"
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="cursor-pointer w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="LOW">Low</option>

                  <option value="MEDIUM">Medium</option>

                  <option value="HIGH">High</option>

                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Assigned Developer
                </label>

                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  disabled={
                    !formData.project || loadingDevelopers || submitting
                  }
                  className="cursor-pointer w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {!formData.project
                      ? "Select project first"
                      : loadingDevelopers
                        ? "Loading developers..."
                        : "Unassigned"}
                  </option>

                  {developers.map((developer) => (
                    <option key={developer._id} value={developer._id}>
                      {developer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Estimated Hours
                </label>

                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter estimated hours"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Due Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="cursor-pointer w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-gray-200 py-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-lg cursor-pointer border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg cursor-pointer bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Task"
                    : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
