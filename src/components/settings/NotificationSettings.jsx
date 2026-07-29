function NotificationSettings() {
  const options = [
    "Task assignment notifications",
    "Project updates",
    "New comments",
    "Email notifications",
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Notifications</h2>

      <p className="mt-1 text-sm text-gray-500">
        Control how you receive updates.
      </p>

      <div className="mt-5 space-y-4">
        {options.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
          >
            <p className="font-medium text-gray-800">{item}</p>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-blue-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationSettings;
