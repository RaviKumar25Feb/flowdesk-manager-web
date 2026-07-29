import { RxCross2 } from "react-icons/rx";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getDevelopers,
  getAssignedDevelopers,
  assignDevelopers,
} from "../../services/team.service";
import Spinner from "../common/Spinner";

const AssignDeveloperModal = ({ open, project, onClose, onSuccess }) => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [loading, setLoading] = useState(true); // fetching
  const [saving, setSaving] = useState(false); // save button

  useEffect(() => {
    if (!open || !project) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [developersRes, assignedRes] = await Promise.all([
          getDevelopers(),
          getAssignedDevelopers(project._id),
        ]);

        setDevelopers(developersRes.data.data);
        setSelectedDevelopers(assignedRes.data.data.map((dev) => dev._id));
      } catch (error) {
        toast.success("Error while fetching developers or assigned developers");
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, project]);

  useEffect(() => {
    if (!open) {
      setDevelopers([]);
      setSelectedDevelopers([]);
      setLoading(true);
      setSaving(false);
    }
  }, [open]);

  const handleToggle = (developerId) => {
    setSelectedDevelopers((prev) =>
      prev.includes(developerId)
        ? prev.filter((id) => id !== developerId)
        : [...prev, developerId],
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await assignDevelopers({
        projectId: project._id,
        developers: selectedDevelopers,
      });

      toast.success("Developer assignments updated.");

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to assign developers.");
      console.error(error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-md bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-2">
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-semibold text-gray-900">
              Assign Developers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select developers to assign to this project.
            </p>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-2 p-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Project</label>

            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="font-semibold text-gray-900">{project?.name}</p>

              <p className="mt-1 text-sm text-gray-500">
                {project?.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Developers List */}
          <div className="max-h-70 sidebar-scroll overflow-y-auto rounded-lg border border-gray-200">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : developers.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-500">
                No developers found.
              </p>
            ) : (
              developers.map((developer) => (
                <label
                  key={developer._id}
                  className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-4 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-medium text-gray-900">
                      {developer.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {developer.profile?.designation || "Developer"}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={selectedDevelopers.includes(developer._id)}
                    onChange={() => handleToggle(developer._id)}
                    className="h-3 w-3 cursor-pointer rounded"
                  />
                </label>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex text-sm flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-gray-300 px-5 py-2.5 text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Spinner /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignDeveloperModal;
