import { FiEdit3, FiMapPin, FiMail } from "react-icons/fi";

function ProfileHeader({ user }) {
  const profile = user?.profile;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-blue-100">
            <img
              src={profile?.avatar}
              alt={user?.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {user?.role}
              </span>
            </div>

            <p className="mt-1 text-gray-600">{profile?.designation}</p>

            <div className="mt-3 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex items-center gap-2">
                <FiMail />
                {user?.email}
              </div>

              <div className="flex items-center gap-2">
                <FiMapPin />
                {profile?.city}, {profile?.country}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
          <FiEdit3 />
          Edit Profile
        </button>
      </div>

      {/* Bio */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <h3 className="text-sm font-semibold text-gray-800">About</h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          {profile?.bio || "No bio added yet."}
        </p>
      </div>
    </div>
  );
}

export default ProfileHeader;
