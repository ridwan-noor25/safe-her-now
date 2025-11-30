import React from "react";
import Layout from "../components/Layout";

const ModeratorDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Moderator Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Pending Queue</h3>
            <p className="text-sm text-gray-600 mt-2">Review and triage new reports.</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Insights</h3>
            <p className="text-sm text-gray-600 mt-2">Quick stats about recent activity.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow table-responsive">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2">Report</th>
                <th className="p-2">Submitted</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">User complaint</td>
                <td className="p-2">2025-11-28</td>
                <td className="p-2"><button className="px-3 py-1 border rounded">Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ModeratorDashboard;
