import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "sonner";

import { getClients, getClientsOverview } from "../services/client.service";

import ClientsTable from "../components/clients/ClientsTable";
import Pagination from "../components/common/Pagination";
import ClientFormModal from "../components/clients/ClientFormModal";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [overview, setOverview] = useState({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
  });

  const [overviewLoading, setOverviewLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalUsers: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchOverview = useCallback(async () => {
    try {
      setOverviewLoading(true);

      const response = await getClientsOverview();

      setOverview(response.data.data);
    } catch (error) {
      console.error(
        "Fetch Clients Overview Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to fetch clients overview.",
      );
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const fetchClients = useCallback(async () => {
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

      const response = await getClients(params);

      setClients(response.data.data || []);

      setPagination((previous) => ({
        ...previous,
        ...response.data.pagination,
      }));
    } catch (error) {
      console.error(
        "Fetch Clients Error:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to fetch clients.");
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.perPage, search, status]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setShowClientModal(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
    setSelectedClient(null);
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());

      setPagination((previous) => ({
        ...previous,
        currentPage: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);

    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));
  };

  const handlePageChange = (page) => {
    setPagination((previous) => ({
      ...previous,
      currentPage: page,
    }));
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-md border border-gray-100 bg-gray-50 px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage client accounts and view assigned projects.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddClient}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus className="text-lg" />
            Add Client
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            title="Total Clients"
            value={overview.totalClients}
            loading={overviewLoading}
          />

          <OverviewCard
            title="Active Clients"
            value={overview.activeClients}
            loading={overviewLoading}
          />

          <OverviewCard
            title="Inactive Clients"
            value={overview.inactiveClients}
            loading={overviewLoading}
          />
        </div>

        {/* Filters */}
        <div className="rounded-md border border-gray-100 bg-gray-50 px-5 py-3 shadow-sm">
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
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-48"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <ClientsTable
          clients={clients}
          loading={loading}
          fetchClients={fetchClients}
          onEditClient={handleEditClient}
          fetchOverview={fetchOverview}
        />

        {!loading && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <ClientFormModal
        open={showClientModal}
        client={selectedClient}
        onClose={handleCloseClientModal}
        onSuccess={fetchClients}
        fetchOverview={fetchOverview}
      />
    </>
  );
};

const OverviewCard = ({ title, value, loading }) => {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold text-gray-900">
        {loading ? "..." : value}
      </h2>
    </div>
  );
};

export default Clients;
