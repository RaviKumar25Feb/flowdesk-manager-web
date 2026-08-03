import { FiSearch } from "react-icons/fi";

const ProjectFilters = ({
  search,
  onSearch,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
}) => {
  return (
    <div className="rounded-md border border-gray-100 bg-gray-50 px-5 py-3 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-gray-200
              bg-white
              py-2
              pr-4
              pl-11
              text-sm
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="
            rounded-lg
            border
            cursor-pointer
            border-gray-200
            bg-white
            px-4
            py-2
            text-sm
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >
          <option value="ALL">All Status</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="TESTING">Testing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="
            rounded-lg
            border
            border-gray-200
            bg-white
            px-4
            py-2
            text-sm
            outline-none
            cursor-pointer
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >
          <option value="ALL">All Priority</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>
    </div>
  );
};

export default ProjectFilters;
