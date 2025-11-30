import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Blog: React.FC = () => {
  // placeholder posts
  const posts = [
    { id: "1", title: "Staying Safe Online", excerpt: "Tips to protect your privacy." },
    { id: "2", title: "How Reporting Works", excerpt: "What happens after you submit a report." },
  ];

  return (
    <Layout>
      <div className="responsive-container py-10">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <article key={p.id} className="p-4 bg-white rounded shadow">
              <h2 className="font-semibold text-lg">{p.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{p.excerpt}</p>
              <Link to={`/blog/${p.id}`} className="mt-3 inline-block text-indigo-600">Read more</Link>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
