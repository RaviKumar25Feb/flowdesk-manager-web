import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "sonner";

import { getDevelopers } from "../services/developer.service";

import DevelopersTable from "../components/developers/DevelopersTable";
import Pagination from "../components/common/Pagination";
import DeveloperFormModal from "../components/developers/DeveloperFormModal";

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalUsers: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const handleAddDeveloper = () => {
    setSelectedDeveloper(null);
    setShowDeveloperModal(true);
  };

  const handleEditDeveloper = (developer) => {
    setSelectedDeveloper(developer);
    setShowDeveloperModal(true);
  };

  const handleCloseDeveloperModal = () => {
    setShowDeveloperModal(false);
    setSelectedDeveloper(null);
  };

  const fetchDevelopers = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.currentPage,
        limit: pagination.perPage,
        search: search || undefined,
        isActive: status === "ALL" ? undefined : status === "ACTIVE",
        sortBy: "createdAt",
        order: "desc",
      };

      const response = await getDevelopers(params);

      setDevelopers(response.data.data || []);

      setPagination((prev) => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (error) {
      console.error(
        "Fetch Developers Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to fetch developers.",
      );
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.perPage, search, status]);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());

      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developers</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage developer accounts and view their work.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDeveloper}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus className="text-lg" />
            Add Developer
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={status}
              onChange={handleStatusChange}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-48"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <DevelopersTable
          developers={developers}
          loading={loading}
          fetchDevelopers={fetchDevelopers}
          onEditDeveloper={handleEditDeveloper}
        />

        {!loading && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <DeveloperFormModal
        open={showDeveloperModal}
        developer={selectedDeveloper}
        onClose={handleCloseDeveloperModal}
        onSuccess={fetchDevelopers}
      />
    </>
  );
};

export default Developers;
