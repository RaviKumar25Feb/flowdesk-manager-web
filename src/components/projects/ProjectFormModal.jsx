import { useEffect, useState } from "react";
import {
  getClients,
  createProject,
  updateProject,
} from "../../services/project.service";
import { toast } from "sonner";
import { RxCross2 } from "react-icons/rx";
import Spinner from "../common/Spinner";
import { useDashboard } from "../../context/DashboardContext";

const ProjectFormModal = ({ open, project, onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const { refreshDashboard } = useDashboard();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client: "",
    priority: "MEDIUM",
    startDate: "",
    deadline: "",
    status: "IN_PROGRESS",
  });

  useEffect(() => {
    if (!open) return;

    const fetchClients = async () => {
      try {
        const response = await getClients();
        setClients(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClients();
  }, [open]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        client: project.client?._id || "",
        priority: project.priority || "MEDIUM",
        status: project.status || "IN_PROGRESS",
        startDate: project.createdAt ? project.createdAt.slice(0, 10) : "",
        deadline: project.deadline ? project.deadline.slice(0, 10) : "",
      });
    } else {
      resetForm();
    }
  }, [project, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      client: "",
      priority: "MEDIUM",
      startDate: "",
      deadline: "",
      status: "IN_PROGRESS",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (project) {
        await updateProject(project._id, formData);
        toast.success("Project updated successfully.");
      } else {
        await createProject(formData);
        toast.success("Project created successfully.");
      }

      await refreshDashboard();

      resetForm();
      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between shadow px-4 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            {project ? "Edit Project" : "Create Project"}
          </h2>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] space-y-5 overflow-y-auto px-4 py-6 sm:px-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={4}
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Client
            </label>

            <select
              name="client"
              required
              value={formData.client}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select Client</option>

              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Priority
              </label>

              <select
                name="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
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
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="IN_PROGRESS">In Progress</option>

                <option value="ON_HOLD">On Hold</option>

                <option value="TESTING">Testing</option>

                <option value="COMPLETED">Completed</option>

                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex rounded-2xl flex-col-reverse gap-3 shadow px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg cursor-pointer border border-gray-300 px-5 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg cursor-pointer bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <div className="w-full px-2.5">
                  <Spinner />
                </div>
              ) : project ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
