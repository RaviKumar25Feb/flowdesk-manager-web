const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">FlowDesk</h2>
          <p className="text-sm text-gray-500">Loading your workspace...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
