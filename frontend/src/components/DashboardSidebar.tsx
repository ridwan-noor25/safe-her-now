import React from "react";
import { Link } from "react-router-dom";

const DashboardSidebar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <aside className={`hidden md:block w-64 bg-white border-r p-5 ${className}`}>
      <h2 className="text-lg font-semibold mb-6">Dashboard</h2>

      <nav className="space-y-3 text-sm">
        <Link to="/user-dashboard" className="block p-2 rounded hover:bg-gray-100">Overview</Link>
        <Link to="/reports" className="block p-2 rounded hover:bg-gray-100">My Reports</Link>
        <Link to="/profile" className="block p-2 rounded hover:bg-gray-100">Profile</Link>
        <Link to="/settings" className="block p-2 rounded hover:bg-gray-100">Settings</Link>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
