import axios from "axios";
import type { AuthResponse } from "../types";

export const api = axios.create({
  baseURL: "",
});

export function resolveAssetUrl(url?: string) {
  if (!url) return "";
  return url.startsWith("/") ? `http://localhost:8080${url}` : url;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@BoiaAqui:token");
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

const TOKEN_KEY = "@BoiaAqui:token";
const TYPE_KEY = "@BoiaAqui:tipoUsuario";
const ID_KEY = "@BoiaAqui:idUsuario";
const NAME_KEY = "@BoiaAqui:nomeUsuario";
const EMAIL_KEY = "@BoiaAqui:emailUsuario";

export function saveSession(auth: AuthResponse) {
  console.log("saveSession auth:", auth);
  console.log("Token salvo:", auth.token);
  console.log("Role salva:", auth.tipo);

  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(TYPE_KEY, auth.tipo);
  localStorage.setItem(ID_KEY, String(auth.id));
  localStorage.setItem(NAME_KEY, auth.nome);
  localStorage.setItem(EMAIL_KEY, auth.email);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TYPE_KEY);
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function getSession(): AuthResponse | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const tipo = localStorage.getItem(TYPE_KEY) as AuthResponse["tipo"] | null;
  const idString = localStorage.getItem(ID_KEY);
  const nome = localStorage.getItem(NAME_KEY);
  const email = localStorage.getItem(EMAIL_KEY);

  if (!token || !tipo || !idString || !nome || !email) {
    return null;
  }

  const id = Number(idString);

  if (Number.isNaN(id)) {
    return null;
  }

  return {
    token,
    id,
    nome,
    email,
    tipo,
  };
}
