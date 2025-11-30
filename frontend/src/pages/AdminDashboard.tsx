import React from "react";
import Layout from "../components/Layout";

const AdminDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Total Reports</div>
            <div className="mt-2 text-2xl font-semibold">128</div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Active Users</div>
            <div className="mt-2 text-2xl font-semibold">32</div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Open Issues</div>
            <div className="mt-2 text-2xl font-semibold">23</div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Moderators</div>
            <div className="mt-2 text-2xl font-semibold">5</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow table-responsive">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">admin@savegirls.com</td>
                <td className="p-2">Admin</td>
                <td className="p-2">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
