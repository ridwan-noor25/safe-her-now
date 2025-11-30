import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API to register
    console.log("register", { email });
    navigate("/user-dashboard");
  };

  return (
    <Layout>
      <div className="responsive-container py-12">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-xl font-semibold">Create an account</h1>

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

            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Register</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
