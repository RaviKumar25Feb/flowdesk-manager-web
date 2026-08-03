import DeveloperRow from "./DeveloperRow";
import Spinner from "../common/Spinner";

const DevelopersTable = ({
  developers,
  loading,
  onEditDeveloper,
  fetchDevelopers,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto sidebar-scroll">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-4">Developer</th>
              <th className="px-4 py-4">Designation</th>
              <th className="px-4 py-4 text-center">Projects</th>
              <th className="px-4 py-4 text-center">Tasks</th>
              <th className="px-4 py-4 text-center">Completed</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Joined</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-16">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : developers.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-16 text-center text-sm text-gray-500"
                >
                  No developers found.
                </td>
              </tr>
            ) : (
              developers.map((developer) => (
                <DeveloperRow
                  key={developer._id}
                  developer={developer}
                  onEditDeveloper={onEditDeveloper}
                  fetchDevelopers={fetchDevelopers}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevelopersTable;
