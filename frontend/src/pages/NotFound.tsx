import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="responsive-container py-20 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-4 text-gray-600">Page not found.</p>
        <Link to="/" className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded">Go home</Link>
      </div>
    </Layout>
  );
};

export default NotFound;
