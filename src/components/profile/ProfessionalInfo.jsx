import { FiBriefcase, FiLayers, FiAward } from "react-icons/fi";

function ProfessionalInfo({ user }) {
  const profile = user?.profile;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Professional Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Work profile, department and technical expertise.
        </p>
      </div>

      {/* Main Info */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Designation */}
        <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <FiBriefcase className="text-xl" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Designation
            </p>

            <p className="mt-1 font-semibold text-gray-800">
              {profile?.designation || "Not available"}
            </p>
          </div>
        </div>

        {/* Department */}
        <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <FiLayers className="text-xl" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Department
            </p>

            <p className="mt-1 font-semibold text-gray-800">
              {profile?.department || "Not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <FiAward className="text-blue-600" />

          <h3 className="text-sm font-semibold text-gray-800">
            Skills & Expertise
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile?.skills?.length > 0 ? (
            profile.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No skills added.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessionalInfo;
