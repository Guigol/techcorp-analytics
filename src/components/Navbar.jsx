import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Search, User, Settings, SunMoon } from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation(); // pour savoir quelle page est active

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3">
      {/* Logo + Titre + Menu */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <img src="/octopus.svg" alt="TechCorp" className="w-8 h-8" />
        {/* Titre */}
        <span className="font-bold text-xl">TechCorp Analytics</span>
        {/* Menu (rapproché) */}
        <ul className="hidden md:flex gap-6 font-medium text-gray-700 ml-6">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`hover:text-blue-600 cursor-pointer ${
                  location.pathname === item.path ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions à droite */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Settings */}
        <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />

        {/* Dark/Light mode */}
        <SunMoon className="w-6 h-6 text-gray-600 cursor-pointer" />

        {/* Notifications */}
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            3
          </span>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <User
            className="w-7 h-7 text-gray-700 cursor-pointer"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          />
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Settings
              </button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <Menu
          className="md:hidden w-7 h-7 text-gray-700 cursor-pointer"
          onClick={() => setOpenMenu(!openMenu)}
        />
      </div>
    </nav>
  );
}
