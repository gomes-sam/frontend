import axios from "axios";
import { getAccessToken } from "./session";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export const api = axios.create({
  baseURL: API_URL,
});

export function resolveAssetUrl(url?: string) {
  if (!url) return "";
  if (!url.startsWith("/")) return url;
  return `${API_URL || "http://localhost:8080"}${url}`;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("Acesso negado - Verifique autenticação");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Erro de conexão - Backend não está disponível");
    }
    return Promise.reject(error);
  }
);
