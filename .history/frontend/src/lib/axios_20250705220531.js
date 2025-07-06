import axios from "axios";

const isDev = import.meta.env.MODE === "development";

// ✅ Make sure production URL includes /api
const BASE_URL = isDev
  ? "http://localhost:5001/api"
  : import.meta.env.VITE_API_BASE_URL; // MUST end in /api

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
