import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const BASE_URL = isDev
  ? "http://localhost:5001/api"
  : import.meta.env.VITE_API_BASE_URL; // ✅ Should be https://.../api

// For development, allow localhost:5174 to connect to localhost:5001
if (isDev) {
  // No change needed, but ensure CORS is configured properly
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", // ✅ helps CORS
  },
});
