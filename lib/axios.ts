import { getToken, setToken } from "@/providers/ProfileProvider";
import axios, { AxiosInstance } from "axios";

const WHITE_LIST = ["/login", "/register"];

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.setAuthorization(`Bearer ${token}`);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Ensure this runs only on the client side
    if (typeof window !== "undefined") {
      // Check if the error is a 401
      if (error.response?.status === 401) {
        setToken(null);

        if (!WHITE_LIST.includes(window.location.pathname)) {
          // Redirect to /login
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error); // Propagate the error for other handling
  }
);

export default api;
