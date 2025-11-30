import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API to login, set auth token, redirect
    console.log("login", { email });
    navigate("/user-dashboard");
  };

  return (
    <Layout>
      <div className="responsive-container py-12">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-xl font-semibold">Log in</h1>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm">Email</span>
              <input
                type="email"
                className="mt-2 w-full p-3 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm">Password</span>
              <input
                type="password"
                className="mt-2 w-full p-3 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="flex items-center justify-between">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded">Log in</button>
              <Link to="/register" className="text-sm text-indigo-600">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
