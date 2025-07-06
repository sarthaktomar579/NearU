import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const BASE_URL = isDev
  ? "http://localhost:5001/api"
  : import.meta.env.VITE_API_BASE_URL; // ✅ Should be https://.../api

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", // ✅ helps CORS
  },
});
