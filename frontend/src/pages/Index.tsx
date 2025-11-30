import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Index: React.FC = () => {
  return (
    <Layout>
      <section className="py-12">
        <div className="responsive-container">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Report Harassment Safely & Securely
              </h1>
              <p className="mt-4 text-gray-600">
                SafeHer provides a secure, anonymous way to report harassment and get help.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/about"
                  className="inline-block px-6 py-3 border rounded-md text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="flex-1">
              <img src="/hero.png" alt="Support" className="img-fluid rounded shadow" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="responsive-container">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded shadow-sm">
              <h3 className="font-semibold">1. Report</h3>
              <p className="text-sm mt-2">Fill a short form to report the incident.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded shadow-sm">
              <h3 className="font-semibold">2. Review</h3>
              <p className="text-sm mt-2">Moderators review cases and update statuses.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded shadow-sm">
              <h3 className="font-semibold">3. Support</h3>
              <p className="text-sm mt-2">Get guidance and resources safely.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
