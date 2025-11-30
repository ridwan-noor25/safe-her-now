import React from "react";
import Layout from "../components/Layout";

const Resources: React.FC = () => {
  return (
    <Layout>
      <div className="responsive-container py-10">
        <h1 className="text-2xl font-semibold">Resources</h1>
        <p className="mt-2 text-gray-600">Helpful links and guides for survivors and moderators.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a className="block p-4 bg-white rounded shadow" href="#" rel="noreferrer">Support Organizations</a>
          <a className="block p-4 bg-white rounded shadow" href="#" rel="noreferrer">Legal Guidance</a>
          <a className="block p-4 bg-white rounded shadow" href="#" rel="noreferrer">Safety Checklist</a>
          <a className="block p-4 bg-white rounded shadow" href="#" rel="noreferrer">Mental Health</a>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
