import axios from "axios";
import { useState, type FormEvent } from "react";
import { setAccessToken } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import discordButton from "../assets/discord.svg";
import googleButton from "../assets/google.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username) {
      setError("Please enter your email.");
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

      if (remember) {
        localStorage.setItem("isLoggedIn", "true");
      } else {
        localStorage.removeItem("isLoggedIn");
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
    <div className="min-h-screen max-h-screen flex flex-col bg-gray-100 py-3 justify-center items-center">
      <div className="flex-col shrink min-w-5 min-h-5 w-full max-w-md max-h-screen p-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <h2 className="block text-gray-600 text-center font-bold  ">Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form className="flex flex-col justify-around " onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Username
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md
              focus:ring-2 focus:ring-blue-200 outline-none
              focus:border-blue-400"
              type="username"
              name="text"
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
                className="w-full p-3 border border-gray-300 rounded-md
              focus:ring-2 focus:ring-blue-200 outline-none
              focus:border-blue-400"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="off"
                required
              />
              <button
                style={{ borderRadius: "8px" }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm text-bold font-medium mb-1 hover:bg-gray-200 transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="mt-3 justify-between flex">
            <label className="cursor-pointer">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="mx-2">Remember me</span>
            </label>
            <a className="text-gray-500!" href="http://localhost:3000/register">
              Create an account
            </a>
          </div>
          <button
            style={{ borderRadius: "8px" }}
            className=" mt-2 self-center px-10 py-2 bg-blue-500 border-blue-600 border-2 text-white hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <div className="flex justify-around mt-4 border-t border-gray-300">
          <a href="http://localhost:8080/api/auth/google">
            <img
              src={googleButton}
              style={{ borderRadius: "8px" }}
              className="mt-4 border border-gray-300 h-12 w-30 p-2 shadow-md bg-gray-100 hover:bg-gray-200 hover:shadow-lg hover:scale-120 transition-transform ease-in-out"
            />
          </a>
          <a href="http://localhost:8080/api/auth/discord">
            <img
              src={discordButton}
              style={{ borderRadius: "8px" }}
              className="mt-4 border border-gray-300 h-12 w-30 p-2 shadow-md bg-gray-100 hover:bg-gray-200 hover:shadow-lg hover:scale-120 transition-transform ease-in-out"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
