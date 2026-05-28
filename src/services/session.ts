import type { AuthResponse } from "../types";

const TOKEN_KEY = "@boiaaqui:token";
const TYPE_KEY = "@boiaaqui:tipoUsuario";
const ID_KEY = "@boiaaqui:idUsuario";
const NAME_KEY = "@boiaaqui:nomeUsuario";
const EMAIL_KEY = "@boiaaqui:emailUsuario";
export const SESSION_UPDATED_EVENT = "boiaaqui:session-updated";

const LEGACY_KEYS = {
  token: "@BoiaAqui:token",
  tipo: "@BoiaAqui:tipoUsuario",
  id: "@BoiaAqui:idUsuario",
  nome: "@BoiaAqui:nomeUsuario",
  email: "@BoiaAqui:emailUsuario",
} as const;

function readSessionValue(key: string, legacyKey: string) {
  return localStorage.getItem(key) ?? localStorage.getItem(legacyKey);
}

export function saveSession(auth: AuthResponse, notify = true) {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(TYPE_KEY, auth.tipo);
  localStorage.setItem(ID_KEY, String(auth.id));
  localStorage.setItem(NAME_KEY, auth.nome);
  localStorage.setItem(EMAIL_KEY, auth.email);
  Object.values(LEGACY_KEYS).forEach((key) => localStorage.removeItem(key));
  if (notify) {
    window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TYPE_KEY);
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(EMAIL_KEY);
  Object.values(LEGACY_KEYS).forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
}

export function getAccessToken() {
  return readSessionValue(TOKEN_KEY, LEGACY_KEYS.token);
}

export function getSession(): AuthResponse | null {
  const token = getAccessToken();
  const tipo = readSessionValue(TYPE_KEY, LEGACY_KEYS.tipo) as AuthResponse["tipo"] | null;
  const idString = readSessionValue(ID_KEY, LEGACY_KEYS.id);
  const nome = readSessionValue(NAME_KEY, LEGACY_KEYS.nome);
  const email = readSessionValue(EMAIL_KEY, LEGACY_KEYS.email);

  if (!token || !tipo || !idString || !nome || !email) {
    return null;
  }

  const id = Number(idString);
  if (Number.isNaN(id)) {
    clearSession();
    return null;
  }

  const session = { token, id, nome, email, tipo };
  const missingCanonicalKey = [
    TOKEN_KEY,
    TYPE_KEY,
    ID_KEY,
    NAME_KEY,
    EMAIL_KEY,
  ].some((key) => !localStorage.getItem(key));
  const hasLegacyKey = Object.values(LEGACY_KEYS).some((key) =>
    localStorage.getItem(key)
  );
  if (missingCanonicalKey || hasLegacyKey) {
    saveSession(session, false);
  }
  return session;
}
