import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const BASE_URL = isDev
  ? "http://localhost:5001/api" // local backend for local frontend
  : import.meta.env.VITE_API_BASE_URL; // production backend

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
