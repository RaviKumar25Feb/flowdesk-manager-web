const ProjectHeader = ({
  project,
  StatusBadge,
  PriorityBadge,
  HeaderInfo,
  formatDate,
  formatText,
}) => {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            {project.description || "No project description available."}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Edit Project
          </button>

          <button
            type="button"
            className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Assign Developers
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-gray-200 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <HeaderInfo label="Start Date" value={formatDate(project.startDate)} />

        <HeaderInfo label="Deadline" value={formatDate(project.deadline)} />

        <HeaderInfo label="Created On" value={formatDate(project.createdAt)} />

        <HeaderInfo label="Updated On" value={formatDate(project.updatedAt)} />
      </div>
    </section>
  );
};

export default ProjectHeader;
