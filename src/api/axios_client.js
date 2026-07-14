import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axios_client = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axios_client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios_client;
