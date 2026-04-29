import axios from "axios";
import { useState, type FormEvent } from "react";
import api, { setAccessToken } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import discordButton from "../assets/discord.svg";
import googleButton from "../assets/google.png";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username) {
      setError("Please enter your username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password },
        { withCredentials: true },
      );

      const newToken = res.data.accessToken;
      setAccessToken(newToken);
      setToken(newToken);

      const userRes = await api.get("http://localhost:8080/api/users/me");
      setUser(userRes.data.user);

      if (remember) {
        localStorage.setItem("isLoggedIn", "true");
      } else {
        sessionStorage.setItem("isLoggedIn", "true");
      }

      navigate("/");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Invalid username or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-gray-600 text-center font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Username
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="off"
                required
              />
              <button
                style={{ borderRadius: "8px" }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:bg-gray-200 transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="/register"
              className="text-sm text-blue-500 hover:underline"
            >
              Create an account
            </Link>
          </div>

          <button
            style={{ borderRadius: "8px" }}
            className="w-full py-2 bg-blue-500 border-2 border-blue-600 text-white hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="flex justify-around mt-4 pt-4 border-t border-gray-300">
          <a href="http://localhost:8080/api/auth/google">
            <img
              src={googleButton}
              style={{ borderRadius: "8px" }}
              className="border border-gray-300 h-12 w-30 p-2 shadow-md bg-gray-100 hover:bg-gray-200 hover:scale-110 transition-transform ease-in-out"
            />
          </a>
          <a href="http://localhost:8080/api/auth/discord">
            <img
              src={discordButton}
              style={{ borderRadius: "8px" }}
              className="border border-gray-300 h-12 w-30 p-2 shadow-md bg-gray-100 hover:bg-gray-200 hover:scale-110 transition-transform ease-in-out"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
