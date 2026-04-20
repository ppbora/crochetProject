import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("");

  const [error, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!username) newErrors.push("Please enter a username.");
    if (!name) newErrors.push("Please enter a name.");
    if (!password) newErrors.push("Please enter a password.");

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.push(
        "Password must be 8-32 chars and include 1 letter, 1 number, and 1 special character.",
      );
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.push("Passwords do not match.");
    }

    if (!gender || (gender !== "male" && gender !== "female")) {
      newErrors.push("Please select male or female.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    const verifyGender = gender == "male" || gender == "female";
    if (!verifyGender) {
      newErrors.push("Please enter male or female");
      return;
    }
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/api/auth/register",
        { username, password },
        { withCredentials: true },
      );
      navigate("/login");
    } catch (error: any) {
      setErrors(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen max-h-200 flex flex-col bg-gray-100 py-3 justify-center items-center">
      <div className="flex-col shrink min-w-5 min-h-5 w-full max-w-md max-h-170 p-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <h2 className="block text-gray-600 text-center font-bold  ">
          Registration
        </h2>
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
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Name
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md
              focus:ring-2 focus:ring-blue-200 outline-none
              focus:border-blue-400"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
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
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="w-full p-3 border border-gray-300 rounded-md
              focus:ring-2 focus:ring-blue-200 outline-none
              focus:border-blue-400"
                type={showConfirmPassword ? "text" : "confirmPassword"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="off"
                required
              />
              <button
                style={{ borderRadius: "8px" }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm text-bold font-medium mb-1 hover:bg-gray-200 transition-colors"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-4 mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Gender
              </label>
              <select
                className="w-full p-3 text-gray-500 border border-gray-300 rounded-md
              focus:ring-2 focus:ring-blue-200 outline-none
              focus:border-blue-400"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <button
            style={{ borderRadius: "8px" }}
            className=" mt-2 self-center px-10 py-2 bg-blue-500 border-blue-600 border-2 text-white hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
