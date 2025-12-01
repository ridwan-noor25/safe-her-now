import { useState } from "react";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const change = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    nav("/");
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={submit}>
        <input name="name" placeholder="Name" onChange={change} />
        <input name="email" placeholder="Email" onChange={change} />
        <input name="password" placeholder="Password" type="password" onChange={change} />

        <button>Submit</button>
      </form>
    </div>
  );
};

export default Register;
