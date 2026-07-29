import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/auth.service";
import { Link } from "react-router-dom";

import {
  FiChevronDown,
  FiUser,
  FiSettings,
  FiKey,
  FiLogOut,
} from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogginOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const [response] = await Promise.all([
        logout(),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      if (response.data.success) {
        setUser(null);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
            Manager Dashboard
          </h1>

          <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
            Beta
          </span>
        </div>
      </div>

      {/* Right */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-gray-100"
        >
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-sm font-semibold text-white">
            {user?.profile?.avatar ? (
              <img
                src={user.profile.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            )}
          </div>

          {/* User */}
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {user?.role}
            </p>
          </div>

          {/* Arrow */}
          <FiChevronDown
            className={`text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-gray-100 px-5 py-4">
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="mt-1 text-xs text-gray-500">{user?.email}</p>
            </div>

            {/* Menu */}
            <div className="py-1">
              <Link
                onClick={() => setIsOpen(false)}
                to="/dashboard/profile"
                className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                <FiUser className="text-base" />
                My Profile
              </Link>

              <Link
                onClick={() => setIsOpen(false)}
                to="/dashboard/settings"
                className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                <FiSettings className="text-base" />
                Settings
              </Link>

              <Link
                onClick={() => setIsOpen(false)}
                to="/dashboard/settings"
                state={{ section: "password" }}
                className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                <FiKey className="text-base" />
                Change Password
              </Link>

              <div className="my-2 border-t border-gray-100"></div>

              <button
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <FiLogOut className="text-base" />
                {isLogginOut ? "Logging out" : "Log out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
