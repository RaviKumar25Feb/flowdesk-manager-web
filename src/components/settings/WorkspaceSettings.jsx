import { FiBriefcase, FiCalendar } from "react-icons/fi";

function WorkspaceSettings() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Workspace Settings</h2>

      <p className="mt-1 text-sm text-gray-500">
        Configure workspace preferences.
      </p>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <div className="flex gap-3">
            <FiBriefcase className="text-blue-600" />
            <div>
              <p className="font-medium">Workspace Name</p>
              <p className="text-sm text-gray-500">Devolyt</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <div className="flex gap-3">
            <FiCalendar className="text-blue-600" />
            <div>
              <p className="font-medium">Date Format</p>
              <p className="text-sm text-gray-500">DD/MM/YYYY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceSettings;
