import { FiMail, FiUser, FiShield } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function AccountSettings() {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>

      <p className="mt-1 text-sm text-gray-500">Basic account information.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-4">
          <FiUser className="text-blue-600" />
          <p className="mt-3 text-xs text-gray-500">Name</p>
          <p className="font-semibold">{user?.name}</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <FiMail className="text-blue-600" />
          <p className="mt-3 text-xs text-gray-500">Email</p>
          <p className="font-semibold">{user?.email}</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <FiShield className="text-blue-600" />
          <p className="mt-3 text-xs text-gray-500">Role</p>
          <p className="font-semibold">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
