import { Link } from "react-router-dom";
const DevelopersCard = ({ developers, UserAvatar }) => {
  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Assigned Developers</h2>

        <span className="text-sm font-semibold text-gray-500">
          {developers.length}
        </span>
      </div>

      {developers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No developers assigned.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {developers.map((developer) => (
            <div key={developer._id} className="flex items-center gap-3">
              <UserAvatar user={developer} />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 hover:text-blue-500">
                  <Link to={`/dashboard/developers/${developer._id}`}>
                    {developer.name}
                  </Link>
                </p>

                <p className="truncate text-xs text-gray-500">
                  {developer.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default DevelopersCard;
