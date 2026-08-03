import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBell,
  FiBriefcase,
  FiInfo,
  FiLock,
  FiMail,
  FiSettings,
  FiShield,
  FiUser,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import ChangePassword from "../components/settings/ChangePassword";

function Settings() {
  const { user } = useAuth();
  const location = useLocation();

  const passwordRef = useRef(null);

  useEffect(() => {
    if (location.state?.section === "password") {
      const timer = setTimeout(() => {
        passwordRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and Devolyt preferences.
        </p>
      </div>

      {/* Account Settings */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Top Header */}
        <div className="border-b border-gray-100 bg-linear-to-r from-blue-50 via-white to-indigo-50 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <FiUser className="text-xl" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Account Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  View your basic Devolyt account information and profile
                  status.
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white shadow px-4 py-2.5 text-sm font-semibold text-blue-700 transition"
            >
              <FiUser />
              View Full Profile
            </Link>
          </div>
        </div>

        {/* Account Details */}
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AccountItem
              icon={<FiUser />}
              label="Full Name"
              value={user?.name}
            />

            <AccountItem
              icon={<FiMail />}
              label="Email Address"
              value={user?.email}
            />

            <AccountItem
              icon={<FiBriefcase />}
              label="Account Role"
              value={formatText(user?.role)}
            />

            <AccountItem
              icon={<FiShield />}
              label="Account Status"
              value={user?.isActive ? "Active" : "Inactive"}
              status={user?.isActive}
            />
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section
        ref={passwordRef}
        className="scroll-mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <FiLock className="text-xl" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">Security</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>

        <ChangePassword />
      </section>

      {/* Preferences */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ComingSoonCard
          icon={<FiBell />}
          title="Notification Preferences"
          description="Manage task assignments, project updates, comments and email alerts."
          features={[
            "Task assignment alerts",
            "Project status updates",
            "Deadline reminders",
          ]}
        />

        <ComingSoonCard
          icon={<FiSettings />}
          title="Workspace Preferences"
          description="Configure your personal workspace experience in Devolyt."
          features={["Timezone", "Date format", "Appearance settings"]}
        />
      </section>

      {/* About */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FiInfo className="text-xl" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">About Devolyt</h2>

            <p className="mt-1 text-sm text-gray-500">
              Internal project and workflow management platform.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AboutItem label="Application" value="Devolyt CRM" />

          <AboutItem label="Version" value="1.0.0" />

          <AboutItem label="Frontend" value="React + Tailwind CSS" />

          <AboutItem label="Backend" value="Node.js + Express + MongoDB" />
        </div>
      </section>
    </div>
  );
}

const AccountItem = ({ icon, label, value, status }) => {
  return (
    <div className="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-100 hover:bg-blue-50/40">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            {status !== undefined && (
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  status ? "bg-green-500" : "bg-red-500"
                }`}
              />
            )}

            <p
              className="truncate text-sm font-semibold text-gray-900"
              title={value || "Not available"}
            >
              {value || "Not available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComingSoonCard = ({ icon, title, description, features }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>

            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Coming Soon
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
          >
            <span className="h-2 w-2 rounded-full bg-gray-400" />

            <p className="text-sm font-medium text-gray-600">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutItem = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
};

const formatText = (value) => {
  if (!value) return "Not available";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export default Settings;
