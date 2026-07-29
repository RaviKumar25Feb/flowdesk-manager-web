const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="rounded-md border border-gray-100 bg-gray-50 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        {/* Left */}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>

          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Right */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`text-2xl ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
