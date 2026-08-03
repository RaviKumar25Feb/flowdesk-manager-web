import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import {
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

import ConfirmModal from "../common/ConfirmModal";
import { useDashboard } from "../../context/DashboardContext";

import {
  activateClient,
  deactivateClient,
} from "../../services/client.service";

const ClientActions = ({
  client,
  fetchClients,
  onEditClient,
  fetchOverview,
}) => {
  const [open, setOpen] = useState(false);

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [showActivateModal, setShowActivateModal] = useState(false);

  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const { refreshDashboard } = useDashboard();

  const handleDeactivate = async () => {
    try {
      setIsDeactivating(true);

      await deactivateClient(client._id);

      toast.success("Client deactivated successfully.");

      await Promise.all([fetchClients(), fetchOverview(), refreshDashboard()]);

      setShowDeactivateModal(false);
    } catch (error) {
      console.error(
        "Deactivate Client Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to deactivate client.",
      );
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleActivate = async () => {
    try {
      setIsActivating(true);

      await activateClient(client._id);

      toast.success("Client activated successfully.");

      await Promise.all([fetchClients(), fetchOverview(), refreshDashboard()]);

      setShowActivateModal(false);
    } catch (error) {
      console.error(
        "Activate Client Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to activate client.",
      );
    } finally {
      setIsActivating(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedInsideDropdown = dropdownRef.current?.contains(event.target);

      const clickedButton = buttonRef.current?.contains(event.target);

      if (!clickedInsideDropdown && !clickedButton) {
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

    const closeDropdown = () => {
      setOpen(false);
    };

    window.addEventListener("scroll", closeDropdown, true);
    window.addEventListener("resize", closeDropdown);

    return () => {
      window.removeEventListener("scroll", closeDropdown, true);
      window.removeEventListener("resize", closeDropdown);
    };
  }, [open]);

  const handleToggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      const menuWidth = 192;
      const estimatedMenuHeight = 170;

      let left = rect.right - menuWidth;
      let top = rect.bottom + 8;

      if (left < 8) {
        left = 8;
      }

      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
      }

      if (top + estimatedMenuHeight > window.innerHeight - 8) {
        top = rect.top - estimatedMenuHeight - 8;
      }

      setPosition({
        top: Math.max(top, 8),
        left,
      });
    }

    setOpen((previous) => !previous);
  };

  return (
    <>
      <div className="inline-block">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggleDropdown}
          className="cursor-pointer rounded-lg p-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-label={`Actions for ${client.name}`}
          aria-expanded={open}
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
                to={`/dashboard/clients/${client._id}`}
                onClick={() => setOpen(false)}
                className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <FiEye />
                View Client
              </Link>

              {client.isActive ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onEditClient?.(client);
                    }}
                    className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <FiEdit2 />
                    Edit Client
                  </button>

                  <div className="border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setShowDeactivateModal(true);
                    }}
                    className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <FiUserX />
                    Deactivate
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setShowActivateModal(true);
                  }}
                  className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-sm text-green-600 transition hover:bg-green-50"
                >
                  <FiUserCheck />
                  Activate
                </button>
              )}
            </div>,
            document.body,
          )}
      </div>

      <ConfirmModal
        isOpen={showDeactivateModal}
        variant="danger"
        title="Deactivate Client"
        message="Are you sure you want to deactivate this client account?"
        itemName={client.name}
        confirmText="Deactivate"
        loading={isDeactivating}
        onCancel={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivate}
      />

      <ConfirmModal
        isOpen={showActivateModal}
        variant="success"
        title="Activate Client"
        message="Are you sure you want to activate this client account?"
        itemName={client.name}
        confirmText="Activate"
        loading={isActivating}
        onCancel={() => setShowActivateModal(false)}
        onConfirm={handleActivate}
      />
    </>
  );
};

export default ClientActions;
