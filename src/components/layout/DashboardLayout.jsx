import { Outlet } from "react-router-dom";
import { useRef } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ScrollToTop from "../common/ScrollToTop";

const DashboardLayout = () => {
  const scrollRef = useRef(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main
          ref={scrollRef}
          className="flex-1 min-w-0 overflow-y-auto py-5 px-3"
        >
          <ScrollToTop scrollRef={scrollRef} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
