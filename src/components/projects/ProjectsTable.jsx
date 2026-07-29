import ProjectRow from "./ProjectRow";
import Pagination from "../common/Pagination";

const ProjectsTable = ({
  projects,
  loading,
  pagination,
  page,
  setPage,
  onEditProject,
  fetchProjects,
  status
}) => {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="animate-pulse divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && projects.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-20 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          No Projects Found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Try changing your filters or create a new project.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-visible rounded-md border border-gray-200 bg-white shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto rounded-md overflow-y-visible sidebar-scroll">
        <table className="w-full min-w-295 table-fixed">
          <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="w-70 px-4 py-4">Project</th>

              <th className="w-45 px-4 py-4">Client</th>

              <th className="w-32.5 px-4 py-4">Team</th>

              <th className="w-42.5 px-4 py-4">Progress</th>

              <th className="w-30 px-4 py-4">Priority</th>

              <th className="w-32.5 px-4 py-4">Status</th>

              <th className="w-37.5 px-4 py-4">Deadline</th>

              <th className="w-32.5 px-4 py-4">Updated</th>

              <th className="w-20 px-2 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <ProjectRow
                key={project._id}
                project={project}
                onEditProject={onEditProject}
                fetchProjects={fetchProjects}
                status={status}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="rounded-md border-t border-gray-200 bg-white px-6 py-4">
        <Pagination pagination={pagination} page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default ProjectsTable;
