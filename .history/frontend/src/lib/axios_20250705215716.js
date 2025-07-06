import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const BASE_URL = isDev
  ? "http://localhost:5001/api" // ✅ local dev
  : import.meta.env.VITE_API_BASE_URL; // ✅ production backend from .env

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
