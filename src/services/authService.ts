import { api } from "./api";
import { endpoints } from "./endpoints";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(endpoints.auth.login, data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(endpoints.auth.register, data);
    return response.data;
  },
};
