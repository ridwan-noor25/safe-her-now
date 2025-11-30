import React, { useState } from "react";
import Layout from "../components/Layout";

const Contact: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send message to contact endpoint
    alert("Message sent (demo)");
    setMessage("");
  };

  return (
    <Layout>
      <div className="responsive-container py-10">
        <h1 className="text-2xl font-semibold">Contact</h1>
        <p className="text-gray-600 mt-2">Reach out for support or partnership inquiries.</p>

        <form onSubmit={handleSubmit} className="mt-6 max-w-lg bg-white p-6 rounded shadow">
          <label className="block">
            <span className="text-sm">Your message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full p-3 border rounded"
              rows={5}
              placeholder="Describe your message..."
              required
            />
          </label>

          <div className="mt-4">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Contact;
