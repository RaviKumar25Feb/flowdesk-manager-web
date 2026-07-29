const ProjectDetailsLoading = () => {
  return (
    <div className="space-y-6">
      <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />

      <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
};
export default ProjectDetailsLoading;
