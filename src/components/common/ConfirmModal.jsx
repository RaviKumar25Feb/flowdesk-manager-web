import { FiAlertTriangle, FiCheckCircle, FiX } from "react-icons/fi";
import Spinner from "./Spinner";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  itemName,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={!loading ? onCancel : undefined}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 ${
                isDanger ? "bg-red-100" : "bg-green-100"
              }`}
            >
              {isDanger ? (
                <FiAlertTriangle className="text-xl text-red-600" />
              ) : (
                <FiCheckCircle className="text-xl text-green-600" />
              )}
            </div>

            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>

          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed"
          >
            <FiX className="text-lg text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          <p className="text-sm leading-6 text-gray-600">{message}</p>

          {itemName && (
            <div
              className={`rounded-xl border px-4 py-3 ${
                isDanger
                  ? "border-red-100 bg-red-50"
                  : "border-green-100 bg-green-50"
              }`}
            >
              <p
                className={`truncate font-semibold ${
                  isDanger ? "text-red-700" : "text-green-700"
                }`}
              >
                {itemName}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500">
            {isDanger
              ? "This action can be undone later."
              : "The project will become active again."}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 p-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`cursor-pointer rounded-lg px-5 py-2.5 font-medium text-white transition disabled:cursor-not-allowed ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                : "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
            }`}
          >
            {loading ? <Spinner /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
