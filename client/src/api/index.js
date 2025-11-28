import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// 🔥 Attach token automatically
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const user = JSON.parse(stored);
    const token = user?.token || user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
