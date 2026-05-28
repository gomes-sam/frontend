import axios from "axios";

interface ErrorPayload {
  erro?: string;
  error?: string;
  message?: string;
  mensagem?: string;
}

export function extractApiError(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (error.code === "ECONNABORTED") {
    return "O servidor demorou para responder. Tente novamente.";
  }

  if (error.code === "ERR_NETWORK") {
    return "Nao foi possivel conectar ao servidor.";
  }

  const payload = error.response?.data;
  if (typeof payload === "string" && payload.trim()) {
    return friendlyMessage(payload);
  }

  if (payload && typeof payload === "object") {
    const data = payload as ErrorPayload;
    const validationMessage = Object.values(payload)
      .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
      .join(" ");
    const message =
      data.message ||
      data.erro ||
      data.error ||
      data.mensagem ||
      validationMessage ||
      JSON.stringify(payload);
    return friendlyMessage(message || fallback);
  }

  if (payload !== undefined && payload !== null) {
    return friendlyMessage(String(payload));
  }

  return fallback;
}

export const getApiErrorMessage = extractApiError;

export function isForbiddenError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 403;
}

export function isRestaurantNotLinkedError(error: unknown) {
  if (!axios.isAxiosError(error)) return false;
  const payload = error.response?.data;
  const text = typeof payload === "string" ? payload : JSON.stringify(payload ?? "");
  return text.toLowerCase().includes("restaurante nao encontrado");
}

function friendlyMessage(message: string) {
  if (message.toLowerCase().includes("restaurante nao encontrado")) {
    return "Seu usuário existe, mas ainda não há restaurante vinculado a esta conta.";
  }

  return message;
}
