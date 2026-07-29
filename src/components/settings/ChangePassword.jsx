import { useRef } from "react";

function ChangePassword() {
  const sectionRef = useRef(null);

  return (
    <div
      ref={sectionRef}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-gray-900">Change Password</h2>

      <p className="mt-1 text-sm text-gray-500">
        Update your account password.
      </p>

      <div className="mt-5 space-y-4 max-w-md">
        <input
          type="password"
          placeholder="Current password"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
        />

        <input
          type="password"
          placeholder="New password"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
        />

        <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Update Password
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
