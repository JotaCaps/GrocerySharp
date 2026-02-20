import axios from "axios";
import { getToken, clearToken } from "./authToken";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: adiciona Bearer token em toda request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: se token expirou/invalidou
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // token inválido/expirado
      clearToken();
    }
    return Promise.reject(err);
  }
);