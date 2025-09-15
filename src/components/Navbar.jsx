import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Search, User, Settings, SunMoon } from "lucide-react";
import { useSearch } from "../context/SearchContext";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const location = useLocation();
  const { search, setSearch } = useSearch();

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-900 shadow px-6 py-3 relative">
      <div className="flex items-center gap-4">
        <img src="/octopus.svg" alt="TechCorp" className="w-8 h-8" />
        <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
          TechCorp
        </span>

        <ul className="hidden md:flex gap-6 font-medium text-gray-700 dark:text-gray-200 ml-6">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-300" />
        </div>

        <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
        <SunMoon
          className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer"
          onClick={() => setDarkMode(!darkMode)}
        />
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            3
          </span>
        </div>

        <div className="relative">
          <User
            className="w-7 h-7 text-gray-700 dark:text-gray-200 cursor-pointer"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          />
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50">
              <button className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Settings
              </button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="relative md:hidden">
          <Menu
            className="w-7 h-7 text-gray-700 dark:text-gray-200 cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          />
          {openMenu && (
            <ul className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === item.path
                        ? "font-semibold text-blue-600 dark:text-blue-400"
                        : ""
                    }`}
                    onClick={() => setOpenMenu(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
