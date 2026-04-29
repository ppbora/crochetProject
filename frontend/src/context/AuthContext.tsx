import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import api, { setAccessToken, onTokenChange } from "../api/axios";

interface User {
  username: string;
  name: string;
  gender: string;
}

interface AuthContextType {
  user: User | null;
  token: string;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onTokenChange((newToken) => {
      setToken(newToken);
    });
  }, []);

  useEffect(() => {
    const silentRefresh = async () => {
      const isLoggedIn =
        localStorage.getItem("isLoggedIn") ||
        sessionStorage.getItem("isLoggedIn");
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

        const userRes = await api.get("http://localhost:8080/api/users/me", {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
        setUser(userRes.data.user);
      } catch (err) {
        localStorage.removeItem("isLoggedIn");
      } finally {
        setLoading(false);
      }
    };

    silentRefresh();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true },
      );
    } finally {
      setAccessToken("");
      setToken("");
      setUser(null);
      localStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("isLoggedIn");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, setUser, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
