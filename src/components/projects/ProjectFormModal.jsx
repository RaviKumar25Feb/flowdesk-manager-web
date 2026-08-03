import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createProject,
  getClients,
  updateProject,
} from "../../services/project.service";

const initialFormData = {
  name: "",
  description: "",
  client: "",
  priority: "MEDIUM",
  status: "IN_PROGRESS",
  startDate: "",
  deadline: "",
};

const ProjectFormModal = ({ open, project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormData);

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const isEdit = Boolean(project);

  // Prefill form while editing
  useEffect(() => {
    if (!open) return;

    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",

        client: project.client?._id || project.client || "",

        priority: project.priority || "MEDIUM",

        status: project.status || "IN_PROGRESS",

        startDate: project.startDate ? project.startDate.split("T")[0] : "",

        deadline: project.deadline ? project.deadline.split("T")[0] : "",
      });
    } else {
      setFormData(initialFormData);
    }

    setError("");
  }, [open, project]);

  // Fetch clients
  useEffect(() => {
    if (!open) return;

    const fetchClients = async () => {
      try {
        setLoadingClients(true);

        const response = await getClients();

        setClients(response.data.data || []);
      } catch (error) {
        setClients([]);

        setError(error.response?.data?.message || "Failed to load clients.");
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (submitting) return;

    setFormData(initialFormData);
    setError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (
      !name ||
      !description ||
      !formData.client ||
      !formData.startDate ||
      !formData.deadline
    ) {
      setError(
        "Name, description, client, start date and deadline are required.",
      );

      return;
    }

    if (new Date(formData.deadline) < new Date(formData.startDate)) {
      setError("Deadline cannot be before the start date.");

      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        name,
        description,
      };

      if (isEdit) {
        await updateProject(project._id, payload);

        toast.success("Project updated successfully.");
      } else {
        await createProject(payload);

        toast.success("Project created successfully.");
      }

      await onSuccess?.();

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} project.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Project" : "Create Project"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="cursor-pointer rounded-md p-2 font-bold text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="max-h-[calc(90vh-60px)] overflow-y-auto sidebar-scroll">
          <form onSubmit={handleSubmit} className="space-y-3 px-6 py-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Project name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Enter project name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>

              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Enter project description"
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            {/* Client */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Client <span className="text-red-500">*</span>
              </label>

              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                disabled={loadingClients || submitting}
                className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">
                  {loadingClients ? "Loading clients..." : "Select Client"}
                </option>

                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="LOW">Low</option>

                  <option value="MEDIUM">Medium</option>

                  <option value="HIGH">High</option>

                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="PLANNING">Planning</option>

                  <option value="IN_PROGRESS">In Progress</option>

                  <option value="ON_HOLD">On Hold</option>

                  <option value="TESTING">Testing</option>

                  <option value="COMPLETED">Completed</option>

                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deadline <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={formData.startDate || undefined}
                  disabled={submitting}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || loadingClients}
                className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Project"
                    : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;
