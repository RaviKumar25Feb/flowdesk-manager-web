// src/pages/Profile.jsx

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiCamera,
  FiEdit3,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";

import { getProfile, updateAvatar } from "../services/profile.service";

import { useAuth } from "../context/AuthContext";

import Spinner from "../components/common/Spinner";
import UpdateProfileModal from "../components/profile/UpdateProfileModal";

const Profile = () => {
  const { checkAuth } = useAuth();

  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getProfile();

      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Fetch Profile Error:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileUpdated = async (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      await fetchProfile();
    }

    await checkAuth?.();
  };

  const handleAvatarClick = () => {
    if (!avatarUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Avatar must be smaller than 5 MB.");
      return;
    }

    try {
      setAvatarUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);
      const response = await updateAvatar(formData);
      setUser((previous) => ({
        ...previous,
        profile: {
          ...previous.profile,
          avatar: response.data.avatar,
        },
      }));

      await checkAuth?.();

      toast.success(response.data?.message || "Avatar updated successfully.");
    } catch (error) {
      console.error(
        "Update Avatar Error:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to update avatar.");
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Profile unavailable
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Your profile information could not be loaded.
        </p>

        <button
          type="button"
          onClick={fetchProfile}
          className="mt-5 cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const profile = user.profile || {};

  const location = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="space-y-6">
        {/* Profile Header */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-28 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-500" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                {/* Avatar */}
                <div className="relative w-fit">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-100 shadow-md sm:h-28 sm:w-28">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-blue-700">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}

                    {avatarUploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                        <Spinner />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    title="Change avatar"
                    onClick={handleAvatarClick}
                    disabled={avatarUploading}
                    className="absolute right-0 bottom-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiCamera />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {/* Basic Information */}
                <div className="pb-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.name}
                    </h1>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {formatText(user.role)}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      />

                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {profile.designation || "Designation not added"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <FiMail />
                      {user.email}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <FiMapPin />
                      {location || "Location not added"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <FiEdit3 />
                Edit Profile
              </button>
            </div>

            {/* Bio */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h2 className="text-sm font-semibold text-gray-900">About</h2>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-600">
                {profile.bio || "No bio added yet."}
              </p>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <ProfileSection
          title="Personal Information"
          description="Basic personal details and contact information."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <InfoCard icon={<FiUser />} label="Full Name" value={user.name} />

            <InfoCard
              icon={<FiPhone />}
              label="Phone Number"
              value={profile.phone}
            />

            <InfoCard
              icon={<FiCalendar />}
              label="Date of Birth"
              value={formatDate(profile.dateOfBirth)}
            />

            <InfoCard
              icon={<FiUser />}
              label="Gender"
              value={formatText(profile.gender)}
            />

            <InfoCard
              icon={<FiMail />}
              label="Email Address"
              value={user.email}
            />

            <InfoCard
              icon={<FiShield />}
              label="Account Role"
              value={formatText(user.role)}
            />
          </div>
        </ProfileSection>

        {/* Professional Information */}
        <ProfileSection
          title="Professional Information"
          description="Work profile, department and technical expertise."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={<FiBriefcase />}
              label="Designation"
              value={profile.designation}
            />

            <InfoCard
              icon={<FiBriefcase />}
              label="Department"
              value={profile.department}
            />
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-900">
              Skills & Expertise
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No skills added yet.</p>
              )}
            </div>
          </div>
        </ProfileSection>

        {/* Address Information */}
        <ProfileSection
          title="Address Information"
          description="Current address and location details."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="sm:col-span-2 xl:col-span-3">
              <InfoCard
                icon={<FiMapPin />}
                label="Address"
                value={profile.address}
              />
            </div>

            <InfoCard icon={<FiMapPin />} label="City" value={profile.city} />

            <InfoCard icon={<FiMapPin />} label="State" value={profile.state} />

            <InfoCard
              icon={<FiGlobe />}
              label="Country"
              value={profile.country}
            />

            <InfoCard
              icon={<FiMapPin />}
              label="Pincode"
              value={profile.pincode}
            />
          </div>
        </ProfileSection>

        {/* Professional Links */}
        <ProfileSection
          title="Professional Links"
          description="Social and professional profiles."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <SocialCard
              icon={<FiLinkedin />}
              label="LinkedIn"
              value={profile.linkedin}
            />

            <SocialCard
              icon={<FiGithub />}
              label="GitHub"
              value={profile.github}
            />

            <SocialCard
              icon={<FiGlobe />}
              label="Portfolio"
              value={profile.portfolio}
            />
          </div>
        </ProfileSection>

        {/* Account Information */}
        <ProfileSection
          title="Account Information"
          description="Read-only FlowDesk account details."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AccountCard
              label="Account Status"
              value={user.isActive ? "Active" : "Inactive"}
              active={user.isActive}
            />

            <AccountCard label="Role" value={formatText(user.role)} />

            <AccountCard label="Joined On" value={formatDate(user.createdAt)} />

            <AccountCard
              label="Last Updated"
              value={formatDate(user.updatedAt)}
            />
          </div>
        </ProfileSection>
      </div>

      <UpdateProfileModal
        open={showEditModal}
        user={user}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleProfileUpdated}
      />
    </>
  );
};

const ProfileSection = ({ title, description, children }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="flex min-h-20 items-start gap-4 rounded-xl bg-gray-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm font-semibold text-gray-800">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

const SocialCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{label}</p>

          {value ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate text-xs text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Not added</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AccountCard = ({ label, value, active }) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {active !== undefined && (
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              active ? "bg-green-500" : "bg-red-500"
            }`}
          />
        )}

        <p className="text-sm font-semibold text-gray-800">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatText = (value) => {
  if (!value) return "Not available";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export default Profile;
