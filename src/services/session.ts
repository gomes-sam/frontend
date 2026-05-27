import type { AuthResponse } from "../types";

const TOKEN_KEY = "@BoiaAqui:token";
const TYPE_KEY = "@BoiaAqui:tipoUsuario";
const ID_KEY = "@BoiaAqui:idUsuario";
const NAME_KEY = "@BoiaAqui:nomeUsuario";
const EMAIL_KEY = "@BoiaAqui:emailUsuario";

export function saveSession(auth: AuthResponse) {
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

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSession(): AuthResponse | null {
  const token = getAccessToken();
  const tipo = localStorage.getItem(TYPE_KEY) as AuthResponse["tipo"] | null;
  const idString = localStorage.getItem(ID_KEY);
  const nome = localStorage.getItem(NAME_KEY);
  const email = localStorage.getItem(EMAIL_KEY);

  if (!token || !tipo || !idString || !nome || !email) {
    return null;
  }

  const id = Number(idString);
  if (Number.isNaN(id)) {
    clearSession();
    return null;
  }

  return { token, id, nome, email, tipo };
}
