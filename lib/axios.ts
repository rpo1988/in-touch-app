import axios, { AxiosInstance } from "axios";

const WHITE_LIST = ["/login", "/register"];

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptors
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Ensure this runs only on the client side
    if (typeof window !== "undefined") {
      // Check if the error is a 401
      if (
        error.response?.status === 401 &&
        !WHITE_LIST.includes(window.location.pathname)
      ) {
        // Redirect to /login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error); // Propagate the error for other handling
  }
);

export default api;
