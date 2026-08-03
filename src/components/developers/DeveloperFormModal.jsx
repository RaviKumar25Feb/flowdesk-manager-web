import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FiX } from "react-icons/fi";

import {
  createDeveloper,
  updateDeveloper,
} from "../../services/developer.service";

import { useDashboard } from "../../context/DashboardContext";

const DeveloperFormModal = ({ open, developer = null, onClose, onSuccess }) => {
  const isEditMode = Boolean(developer);

  const { refreshDashboard } = useDashboard();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (developer) {
      setFormData({
        name: developer.name || "",
        email: developer.email || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
      });
    }

    setErrors({});
  }, [open, developer]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, isSubmitting, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Developer name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      };

      if (isEditMode) {
        await updateDeveloper(developer._id, payload);

        toast.success("Developer updated successfully.");
      } else {
        await createDeveloper(payload);

        toast.success("Developer created successfully.");
      }

      await Promise.all([onSuccess?.(), refreshDashboard()]);

      onClose();
    } catch (error) {
      console.error(
        `${isEditMode ? "Update" : "Create"} Developer Error:`,
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} developer.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? "Edit Developer" : "Add Developer"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update developer account details."
                : "Create a new developer account."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            <div>
              <label
                htmlFor="developer-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Developer Name
              </label>

              <input
                id="developer-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter developer name"
                disabled={isSubmitting}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  errors.name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="developer-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="developer-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="developer@example.com"
                disabled={isSubmitting}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {!isEditMode && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                A temporary password will be generated and sent to the developer
                by email.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Developer"
                  : "Create Developer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeveloperFormModal;
