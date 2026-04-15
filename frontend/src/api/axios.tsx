import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  withCredentials: true,
});

let currentAccessToken = "";
let onTokenRefreshed: ((token: string) => void) | null = null;

export const setAccessToken = (token: string) => {
  currentAccessToken = token;
};

export const onTokenChange = (cb: (token: string) => void) => {
  onTokenRefreshed = cb;
};

api.interceptors.request.use(
  async (config) => {
    if (!currentAccessToken) return config;

    const decoded = jwtDecode(currentAccessToken);
    const currentTime = Date.now() / 1000;
    const isExpired = decoded.exp && decoded.exp - 10 < currentTime;

    if (!isExpired) {
      config.headers["Authorization"] = `Bearer ${currentAccessToken}`;
      return config;
    }

    try {
      const response = await axios.post(
        "/api/auth/refresh",
        {},
        { withCredentials: true },
      );
      currentAccessToken = response.data.accessToken;
      onTokenRefreshed?.(currentAccessToken);
      config.headers["Authorization"] = `Bearer ${currentAccessToken}`;
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => Promise.reject(error),
);

export default api;
