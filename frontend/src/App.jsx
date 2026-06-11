import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle Maintenance Tracker</h1>

      <nav>
        <Link to="/">Login</Link>
        {" | "}
        <Link to="/register">Register</Link>
        {" | "}
        <Link to="/dashboard">Dashboard</Link>
        {" | "}
        <Link to="/maintenance">Maintenance</Link>
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