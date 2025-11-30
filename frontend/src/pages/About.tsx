import React from "react";
import Layout from "../components/Layout";

const About: React.FC = () => {
  return (
    <Layout>
      <div className="responsive-container py-10">
        <h1 className="text-3xl font-bold">About SafeHer</h1>
        <p className="mt-4 text-gray-600 max-w-3xl">
          SafeHer is a harassment reporting system built to be secure, private, and accessible.
          We focus on empowering survivors and streamlining moderation workflows.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">Mission</h3>
            <p className="mt-2 text-sm text-gray-600">Create a safe space for reporting and support.</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">Security</h3>
            <p className="mt-2 text-sm text-gray-600">We use modern auth and encryption best practices.</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">Community</h3>
            <p className="mt-2 text-sm text-gray-600">We work with local organizations for support.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
