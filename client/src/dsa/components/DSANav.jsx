import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiBarChart2,
  FiBookOpen,
  FiBriefcase,
  FiClock,
  FiCode,
  FiFlag,
  FiHome,
  FiMap,
} from "react-icons/fi";

const navItems = [
  {
    label: "DSA Home",
    path: "/dsa",
    icon: FiHome,
  },
  {
    label: "Topic Practice",
    path: "/dsa/topics",
    icon: FiBookOpen,
  },
  {
    label: "Company Practice",
    path: "/dsa/companies",
    icon: FiBriefcase,
  },
  {
    label: "Contest Arena",
    path: "/dsa/contests",
    icon: FiFlag,
  },
  {
    label: "Submissions",
    path: "/dsa/submissions",
    icon: FiClock,
  },
  {
    label: "Analytics",
    path: "/dsa/analytics",
    icon: FiBarChart2,
  },
  {
    label: "Learning Roadmap",
    path: "/dsa/learning-roadmap",
    icon: FiMap,
  },
  {
    label: "Playground",
    path: "/dsa/playground",
    icon: FiCode,
  },
];

const DSANav = () => {
  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950 px-4 py-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="mb-6 px-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
          PrepAI
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          PrepAI Code Arena
        </h2>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dsa"}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <Icon className="text-lg" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DSANav;
