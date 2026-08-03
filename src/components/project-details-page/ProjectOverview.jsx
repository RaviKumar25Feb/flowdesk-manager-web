const ProjectOverview = ({
  project,
  overview,
  formatDate,
  StatItem,
  formatText,
}) => {
  return (
    <section className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Project Progress</p>

          <p className="text-sm font-semibold text-gray-900">
            {overview.progress}%
          </p>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{
              width: `${overview.progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatItem label="Todo" value={overview.todoTasks} />

        <StatItem label="In Progress" value={overview.inProgressTasks} />

        <StatItem label="In Review" value={overview.inReviewTasks} />

        <StatItem label="Completed" value={overview.completedTasks} />

        <StatItem label="Remaining" value={overview.remainingTasks} />

        <StatItem label="Project Status" value={formatText(project.status)} />
      </div>
    </section>
  );
};
export default ProjectOverview;
