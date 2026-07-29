import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ pagination, page, setPage }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing page{" "}
        <span className="font-semibold text-gray-700">
          {pagination.currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-700">
          {pagination.totalPages}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiChevronLeft />
        </button>

        <span className="rounded-lg bg-blue-600 px-5 py-1.5 text-white">
          {page}
        </span>

        <button
          disabled={!pagination.hasNextPage}
          onClick={() => setPage(page + 1)}
          className="rounded-lg border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
