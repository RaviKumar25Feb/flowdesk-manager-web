const ClientCard = ({ client, UserAvatar }) => {
  if (!client) {
    return null;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-gray-900">Client</h2>

      <div className="mt-4 flex items-center gap-3">
        <UserAvatar user={client} />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {client.name}
          </p>

          <p className="truncate text-xs text-gray-500">{client.email}</p>
        </div>
      </div>
    </section>
  );
};
export default ClientCard;
