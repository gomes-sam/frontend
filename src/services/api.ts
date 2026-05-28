import axios from "axios";
import { getAccessToken } from "./session";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export function resolveAssetUrl(url?: string) {
  if (!url) return "";
  if (!url.startsWith("/")) return url;
  return `${API_URL}${url}`;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
