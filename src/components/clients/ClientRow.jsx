import ClientActions from "./ClientActions";
import { Link } from "react-router-dom";

const ClientRow = ({ client, fetchClients, onEditClient, fetchOverview }) => {
  const nameInitial = client.name?.charAt(0).toUpperCase();

  const joinedDate = client.createdAt
    ? new Date(client.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <tr className="transition hover:bg-gray-50">
      {/* Client */}
      <td className="px-4 py-4">
        <div className="flex min-w-56 items-center gap-3">
          {client.profile?.avatar ? (
            <img
              src={client.profile.avatar}
              alt={client.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
              {nameInitial}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 hover:text-blue-500">
              <Link to={`/dashboard/clients/${client._id}`}>{client.name}</Link>
            </p>

            <p className="truncate text-xs text-gray-500">{client.email}</p>
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-4">
        <p className="text-sm text-gray-700">
          {client.profile?.phone || "Not added"}
        </p>
      </td>

      {/* Projects */}
      <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700">
        {client.projectsCount ?? 0}
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            client.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {client.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Joined */}
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
        {joinedDate}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <ClientActions
          client={client}
          fetchClients={fetchClients}
          onEditClient={onEditClient}
          fetchOverview={fetchOverview}
        />
      </td>
    </tr>
  );
};

export default ClientRow;
