const PageBackButton = ({ onClick, ArrowLeft }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-gray-600 transition hover:text-gray-900"
    >
      <ArrowLeft size={18} />
      Back to tasks
    </button>
  );
};

export default PageBackButton;
