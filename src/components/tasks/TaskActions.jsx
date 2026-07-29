import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiMoreVertical, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { useDashboard } from "../../context/DashboardContext";
import { Link, useParams } from "react-router-dom";

import ConfirmModal from "../common/ConfirmModal";
import { deleteTask } from "../../services/task.service";

const TaskActions = ({ task, onViewTask, onEditTask, fetchTasks }) => {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { refreshDashboard } = useDashboard();

  const { taskId } = useParams();

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await deleteTask(task._id);

      toast.success("Task deleted successfully.");

      await Promise.all([refreshDashboard(), fetchTasks()]);

      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete task.");

      console.error(error.response?.data || error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 192;

      let left = rect.right - menuWidth;

      if (left < 8) {
        left = 8;
      }

      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
      }

      setPosition({
        top: rect.bottom + 8,
        left,
      });
    }

    setOpen((previous) => !previous);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(event.target);

      const clickedOutsideButton =
        buttonRef.current && !buttonRef.current.contains(event.target);

      if (clickedOutsideDropdown && clickedOutsideButton) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const closeMenu = () => {
      setOpen(false);
    };

    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [open]);

  return (
    <>
      <div className="inline-block">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggleMenu}
          className="cursor-pointer rounded-lg p-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
              className="z-9999 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
            >
              <Link
                to={`/dashboard/tasks/${task._id}`}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <FiEye />
                View Task
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onEditTask(task);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <FiEdit2 />
                Edit Task
              </button>

              <div className="border-t border-gray-100" />

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setShowDeleteModal(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
              >
                <FiTrash2 />
                Delete Task
              </button>
            </div>,
            document.body,
          )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        variant="danger"
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        itemName={task.title}
        confirmText="Delete"
        loading={deleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default TaskActions;
