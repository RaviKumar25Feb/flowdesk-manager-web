import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useDashboard } from "../../context/DashboardContext";
import AssignDeveloperModal from "./AssignDeveloperModal";
import {
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiRotateCcw,
} from "react-icons/fi";

import ConfirmModal from "../common/ConfirmModal";
import { archiveProject, restoreProject } from "../../services/project.service";

const ProjectActions = ({
  project,
  onEditProject,
  fetchProjects,
  isArchivedView,
}) => {
  const [open, setOpen] = useState(false);

  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);

  const { refreshDashboard } = useDashboard();

  const { projectId } = useParams();

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleArchive = async () => {
    try {
      setIsArchived(true);

      await archiveProject(project._id);

      toast.success("Project archived successfully.");
      await Promise.all([refreshDashboard(), fetchProjects()]);

      setShowArchivedModal(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setIsArchived(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);

      await restoreProject(project._id);
      toast.success("Project restored successfully.");
      await Promise.all([refreshDashboard(), fetchProjects()]);

      setShowRestoreModal(false);
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error.response?.data || error.message);
    } finally {
      setIsRestoring(false);
    }
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <div className="inline-block">
        <button
          ref={buttonRef}
          onClick={() => {
            if (buttonRef.current) {
              const rect = buttonRef.current.getBoundingClientRect();

              const menuWidth = 192;

              let left = rect.right - menuWidth;

              if (left < 8) left = 8;

              if (left + menuWidth > window.innerWidth - 8) {
                left = window.innerWidth - menuWidth - 8;
              }

              setPosition({
                top: rect.bottom + 8,
                left,
              });
            }

            setOpen((prev) => !prev);
          }}
          className="
      cursor-pointer
      rounded-lg
      p-2
      transition
      hover:bg-gray-100
      focus:outline-none
      focus:ring-2
      focus:ring-blue-100
    "
        >
          <FiMoreVertical className="text-lg text-gray-600" />
        </button>

        {open &&
          createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
              }}
              className="
          z-9999
          w-48
          cursor-pointer
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-xl
        "
            >
              {isArchivedView ? (
                <>
                  <div className="border-t border-gray-100" />

                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowRestoreModal(true);
                    }}
                    className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-sm text-green-600 transition hover:bg-green-50"
                  >
                    <FiRotateCcw />
                    Restore Project
                  </button>
                </>
              ) : (
                <>
                  {/* View */}
                  <Link
                    to={`/dashboard/projects/${project._id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <FiEye />
                    View Project
                  </Link>
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      onEditProject(project);
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <FiEdit2 />
                    Edit Project
                  </button>

                  {/* Assign */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowAssignModal(true);
                    }}
                    className="flex cursor-pointer w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <FiUsers />
                    Assign Developer
                  </button>

                  <div className="border-t border-gray-100" />

                  {/* Archive */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowArchivedModal(true);
                    }}
                    className="flex cursor-pointer w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <FiTrash2 />
                    Archive Project
                  </button>
                </>
              )}
            </div>,
            document.body,
          )}
      </div>

      <ConfirmModal
        isOpen={showArchivedModal}
        variant="danger"
        title="Archive Project"
        message="Are you sure you want to archive this project?"
        itemName={project.name}
        confirmText="Archive"
        loading={isArchived}
        onCancel={() => setShowArchivedModal(false)}
        onConfirm={handleArchive}
      />

      <ConfirmModal
        isOpen={showRestoreModal}
        variant="success"
        title="Restore Project"
        message="Are you sure you want to restore this project?"
        itemName={project.name}
        confirmText="Restore"
        loading={isRestoring}
        onCancel={() => setShowRestoreModal(false)}
        onConfirm={handleRestore}
      />

      <AssignDeveloperModal
        open={showAssignModal}
        project={project}
        onClose={() => setShowAssignModal(false)}
        onSuccess={fetchProjects}
      />
    </>
  );
};

export default ProjectActions;
