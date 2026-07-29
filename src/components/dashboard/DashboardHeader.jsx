import { FiPlus } from "react-icons/fi";
import { useDashboard } from "../../context/DashboardContext";
import ProjectFormModal from "../projects/ProjectFormModal";
import { useState } from "react";

const DashboardHeader = () => {
  const { refreshDashboard } = useDashboard();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="flex flex-col gap-5 rounded-md border border-gray-100 bg-gray-50 p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {greeting}
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome back. Here's what's happening across your workspace today.
          </p>

          <p className="mt-3 text-sm font-medium text-gray-400">{today}</p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
          >
            <FiPlus className="text-lg" />
            New Project
          </button>
        </div>
      </div>
      <ProjectFormModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={refreshDashboard}
      />
    </>
  );
};

export default DashboardHeader;
