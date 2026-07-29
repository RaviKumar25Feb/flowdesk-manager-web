import { FiPlus } from "react-icons/fi";

const TasksHeader = ({ onCreateTask }) => {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-100 bg-gray-50 px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage, assign, and track tasks across all your projects.
        </p>
      </div>

      {/* Right */}
      <button
        onClick={onCreateTask}
        className="
          inline-flex
          cursor-pointer
          items-center
          gap-1
          rounded-lg
          bg-blue-600
          px-3
          py-2
          text-sm
          font-semibold
          text-white
          transition-all
          hover:bg-blue-700
          active:scale-[0.98]
        "
      >
        <FiPlus className="text-base" />
        New Task
      </button>
    </div>
  );
};

export default TasksHeader;
