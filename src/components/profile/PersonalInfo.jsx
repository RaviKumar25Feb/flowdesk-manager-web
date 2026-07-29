import { FiPhone, FiCalendar, FiUser, FiMapPin, FiHome } from "react-icons/fi";

function PersonalInfo({ user }) {
  const profile = user?.profile;

  const details = [
    {
      label: "Phone Number",
      value: profile?.phone,
      icon: FiPhone,
    },
    {
      label: "Date of Birth",
      value: profile?.dateOfBirth
        ? new Date(profile.dateOfBirth).toLocaleDateString()
        : "Not available",
      icon: FiCalendar,
    },
    {
      label: "Gender",
      value: profile?.gender,
      icon: FiUser,
    },
    {
      label: "Address",
      value: profile?.address,
      icon: FiHome,
    },
    {
      label: "Location",
      value: `${profile?.city || ""}, ${profile?.state || ""}`,
      icon: FiMapPin,
    },
    {
      label: "Country",
      value: profile?.country,
      icon: FiMapPin,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Basic personal details and contact information.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {details.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-start gap-4 rounded-xl bg-gray-50 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Icon className="text-lg" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {item.value || "Not available"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PersonalInfo;
