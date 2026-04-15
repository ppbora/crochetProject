import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useState, useEffect } from "react";
import api, { setAccessToken, onTokenChange } from "./api/axios";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onTokenChange((newToken) => {
      setToken(newToken);
    });
  }, []);

  useEffect(() => {
    const silentRefresh = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newToken = res.data.accessToken;

        setAccessToken(newToken);
        setToken(newToken);

        const userRes = await api.get("http://localhost:8080/api/users/me");
        setUser(userRes.data.user);
      } catch (err) {
        localStorage.removeItem("isLoggedIn");
      } finally {
        setLoading(false);
      }
    };

    silentRefresh();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
