import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api/auth/login" element={<Register />} />
        <Route path="/api/auth/register" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
