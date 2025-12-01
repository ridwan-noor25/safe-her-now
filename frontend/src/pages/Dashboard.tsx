import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const ctx = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome {ctx?.user?.name}</h1>
      <p>Role: {ctx?.user?.role}</p>

      <button onClick={() => ctx?.logout()}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
