import React from "react";
import Layout from "../components/Layout";

const UserDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">My Reports</h3>
            <p className="text-sm text-gray-600 mt-2">View and manage your submitted reports.</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">New Report</h3>
            <p className="text-sm text-gray-600 mt-2">Submit a new harassment report.</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Support</h3>
            <p className="text-sm text-gray-600 mt-2">Access support resources and contacts.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow table-responsive">
          <table className="min-w-full">
            <thead className="text-left">
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Status</th>
                <th className="p-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Sample Report</td>
                <td className="p-2">Pending</td>
                <td className="p-2">2025-11-29</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
