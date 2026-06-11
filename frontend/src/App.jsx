import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";

function App() {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch(
      "http://localhost:5555/api/logout",
      {
        method: "DELETE",
        credentials: "include"
      }
    );

    navigate("/");
  }

  return (
    <div className="app-container">
      <h1> Vehicle Maintenance Tracker</h1>

      <nav>
        <Link to="/">Login</Link>
        {" | "}
        <Link to="/register">Register</Link>
        {" | "}
        <Link to="/dashboard">Dashboard</Link>
        {" | "}
        <Link to="/maintenance">Maintenance</Link>
        {" | "}
        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </div>
  );
}

export default App;