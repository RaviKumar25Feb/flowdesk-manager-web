// src/components/clients/ClientFormModal.jsx

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

import { createClient, updateClient } from "../../services/client.service";

import { useDashboard } from "../../context/DashboardContext";

const ClientFormModal = ({
  open,
  client = null,
  onClose,
  onSuccess,
  fetchOverview,
}) => {
  const isEditMode = Boolean(client);
  const { refreshDashboard } = useDashboard();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFormData({
      name: client?.name || "",
      email: client?.email || "",
    });

    setErrors({});
  }, [open, client]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Client name is required.";
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
        await updateClient(client._id, payload);
        toast.success("Client updated successfully.");
      } else {
        await createClient(payload);
        toast.success("Client created successfully.");
      }

      await Promise.all([onSuccess?.(), fetchOverview(), refreshDashboard()]);

      onClose();
    } catch (error) {
      console.error(
        `${isEditMode ? "Update" : "Create"} Client Error:`,
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} client.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4"
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
              {isEditMode ? "Edit Client" : "Add Client"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update client account details."
                : "Create a new client account."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Client Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter client name"
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@example.com"
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
                A temporary password will be generated and sent to the client by
                email.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Client"
                  : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
