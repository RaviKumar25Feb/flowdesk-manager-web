function DangerZone() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>

      <p className="mt-1 text-sm text-red-600">
        Actions here can affect your account permanently.
      </p>

      <button className="mt-5 rounded-xl border border-red-600 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white">
        Deactivate Account
      </button>
    </div>
  );
}

export default DangerZone;
