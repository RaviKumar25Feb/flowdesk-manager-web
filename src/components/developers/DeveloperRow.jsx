import DeveloperActions from "./DeveloperActions";

const DeveloperRow = ({ developer, onEditDeveloper, fetchDevelopers }) => {
  const nameInitial = developer.name?.charAt(0).toUpperCase();

  const joinedDate = developer.createdAt
    ? new Date(developer.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <tr className="transition hover:bg-gray-50">
      {/* Developer */}
      <td className="px-4 py-4">
        <div className="flex min-w-56 items-center gap-3">
          {developer.profile?.avatar ? (
            <img
              src={developer.profile.avatar}
              alt={developer.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {nameInitial}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {developer.name}
            </p>

            <p className="truncate text-xs text-gray-500">{developer.email}</p>
          </div>
        </div>
      </td>

      {/* Designation */}
      <td className="px-4 py-4">
        <div>
          <p className="text-sm font-medium text-gray-700">
            {developer.profile?.designation || "Not added"}
          </p>

          {developer.profile?.department && (
            <p className="mt-0.5 text-xs text-gray-500">
              {developer.profile.department}
            </p>
          )}
        </div>
      </td>

      {/* Projects */}
      <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700">
        {developer.projectsCount ?? 0}
      </td>

      {/* Tasks */}
      <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700">
        {developer.assignedTasks ?? 0}
      </td>

      {/* Completed */}
      <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700">
        {developer.completedTasks ?? 0}
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            developer.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {developer.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Joined */}
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
        {joinedDate}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <DeveloperActions
          developer={developer}
          onEditDeveloper={onEditDeveloper}
          fetchDevelopers={fetchDevelopers}
        />
      </td>
    </tr>
  );
};

export default DeveloperRow;
