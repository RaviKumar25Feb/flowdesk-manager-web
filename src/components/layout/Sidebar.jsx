import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiUsers,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: FiHome,
    end: true,
  },
  {
    name: "Projects",
    path: "/dashboard/projects",
    icon: FiFolder,
  },
  {
    name: "Tasks",
    path: "/dashboard/tasks",
    icon: FiCheckSquare,
  },
  {
    name: "Developers",
    path: "/dashboard/developers",
    icon: FiUsers,
  },
  {
    name: "Clients",
    path: "/dashboard/clients",
    icon: FiUsers,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: FiUser,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: FiSettings,
  },
];

const Sidebar = () => {
  const { user, setUser } = useAuth();

  return (
    <>
      <aside className="flex h-screen w-72 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex h-22 items-center gap-3 border-b border-gray-200 px-6">
          {/* Company Logo */}
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <img
              src="/favicon.ico"
              alt="Devolyt"
              className="h-8 w-8 object-contain"
            />
          </div>

          {/* Company Name */}
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
              Devo<span className="text-blue-600">lyt</span>
            </h1>

            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gray-400">
              Project Management
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `
                    flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                    `
                    }
                  >
                    <Icon className="text-lg" />

                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom User Section */}
        <div className="border-t border-gray-200 px-4 py-2">
          <div className="flex items-center gap-3 rounded-xl p-3">
            <img
              src={user?.profile?.avatar}
              alt="profile"
              className="h-11 w-11 rounded-full object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user?.name}
              </p>

              <p className="text-xs uppercase text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
