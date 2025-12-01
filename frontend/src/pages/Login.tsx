import { useState, useContext } from "react";
import api from "../lib/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const ctx = useContext(AuthContext);
  const nav = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const change = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();

    const res = await api.post("/auth/login", form);
    ctx?.login(res.data.token, res.data.user);

    nav("/dashboard");
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={submit}>
        <input name="email" placeholder="Email" onChange={change} />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={change}
        />

        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
