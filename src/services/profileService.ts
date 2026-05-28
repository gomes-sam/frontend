import { SESSION_UPDATED_EVENT } from "./session";

const PROFILE_KEY = "@boiaaqui:perfilLocal";

export interface LocalProfile {
  usuarioId?: number;
  nomeExibido?: string;
  telefone?: string;
  cpf?: string;
  fotoPerfil?: string;
  tema?: "claro" | "quente";
}

export function getLocalProfile(usuarioId?: number): LocalProfile {
  const value = localStorage.getItem(PROFILE_KEY);
  if (!value) return {};

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      localStorage.removeItem(PROFILE_KEY);
      return {};
    }

    const profile = parsed as LocalProfile;
    if (usuarioId && profile.usuarioId && profile.usuarioId !== usuarioId) {
      return {};
    }
    return profile;
  } catch {
    localStorage.removeItem(PROFILE_KEY);
    return {};
  }
}

export function saveLocalProfile(profile: LocalProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
}
