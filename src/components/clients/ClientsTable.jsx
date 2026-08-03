import ClientRow from "./ClientRow";
import Spinner from "../common/Spinner";

const ClientsTable = ({
  clients,
  loading,
  fetchClients,
  onEditClient,
  fetchOverview,
}) => {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-4">Client</th>
              <th className="px-4 py-4">Phone</th>
              <th className="px-4 py-4 text-center">Projects</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Joined</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-16">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-16 text-center text-sm text-gray-500"
                >
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <ClientRow
                  key={client._id}
                  client={client}
                  fetchClients={fetchClients}
                  onEditClient={onEditClient}
                  fetchOverview={fetchOverview}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;
