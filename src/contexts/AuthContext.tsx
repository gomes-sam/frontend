/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { clearSession, getSession, saveSession } from "../services/api";
import type { AuthResponse, TipoUsuario } from "../types";

interface AuthContextValue {
  user: AuthResponse | null;
  token: string | null;
  tipo: TipoUsuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<AuthResponse>;
  register: (dados: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone: string;
    tipo: TipoUsuario;
  }) => Promise<AuthResponse>;
  logout: () => void;
  defaultRoute: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getDefaultRoute = (tipo: TipoUsuario | null) => {
  if (tipo === "ADMIN") return "/admin/home";
  if (tipo === "RESTAURANTE" || tipo === "FUNCIONARIO") return "/restaurante/painel";
  return "/";
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(getSession());

  const login = async (email: string, senha: string) => {
    const response = await authService.login({ email, senha });
    saveSession(response);
    setUser(response);
    return response;
  };

  const register = async (dados: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone: string;
    tipo: TipoUsuario;
  }) => {
    const response = await authService.register(dados);
    saveSession(response);
    setUser(response);
    return response;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token: user?.token ?? null,
      tipo: user?.tipo ?? null,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      defaultRoute: getDefaultRoute(user?.tipo ?? null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }
  return context;
}
