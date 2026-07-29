import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import AccountSettings from "../components/settings/AccountSettings";
import WorkspaceSettings from "../components/settings/WorkspaceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import ChangePassword from "../components/settings/ChangePassword";
import DangerZone from "../components/settings/DangerZone";

function Settings() {
  const location = useLocation();

  const passwordRef = useRef(null);

  useEffect(() => {
    if (location.state?.section === "password") {
      setTimeout(() => {
        passwordRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [location]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and workspace settings.
        </p>
      </div>

      <AccountSettings />

      <WorkspaceSettings />

      <NotificationSettings />

      {/* Password Section */}
      <div ref={passwordRef}>
        <ChangePassword />
      </div>

      <DangerZone />
    </div>
  );
}

export default Settings;
