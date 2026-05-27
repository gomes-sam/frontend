import axios from "axios";

interface ErrorPayload {
  erro?: string;
  error?: string;
  message?: string;
  mensagem?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (error.code === "ERR_NETWORK") {
    return "Nao foi possivel conectar ao servidor.";
  }

  const payload = error.response?.data;
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const data = payload as ErrorPayload;
    return data.erro || data.mensagem || data.message || data.error || fallback;
  }

  return fallback;
}
