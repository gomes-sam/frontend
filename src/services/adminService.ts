import { api } from "./api";
import { endpoints } from "./endpoints";
import type { Restaurante, SpringPageResponse, Usuario } from "../types";

function toPage<T>(data: SpringPageResponse<T> | T[]): SpringPageResponse<T> {
  if (!Array.isArray(data)) return data;
  return {
    content: data,
    totalElements: data.length,
    totalPages: 1,
    size: data.length,
    number: 0,
  };
}

export const adminService = {
  async listarUsuarios(pagina = 0, tamanho = 20) {
    const response = await api.get<SpringPageResponse<Usuario> | Usuario[]>(endpoints.admin.usuarios, { params: { page: pagina, size: tamanho } });
    return toPage(response.data);
  },

  async listarClientes(pagina = 0, tamanho = 20) {
    const response = await api.get<SpringPageResponse<Usuario> | Usuario[]>(endpoints.admin.usuarios, {
      params: { page: pagina, size: tamanho, tipo: "CLIENTE" },
    });
    return toPage(response.data);
  },

  async ativarDesativarUsuario(id: number) {
    const response = await api.patch<Usuario>(endpoints.admin.alternarUsuario(id));
    return response.data;
  },

  async deletarUsuario(id: number) {
    await api.delete<void>(endpoints.admin.deletarUsuario(id));
  },

  async listarRestaurantes(pagina = 0, tamanho = 20) {
    const response = await api.get<SpringPageResponse<Restaurante> | Restaurante[]>(endpoints.admin.restaurantes, { params: { page: pagina, size: tamanho } });
    return toPage(response.data);
  },

  async ativarDesativarRestaurante(id: number) {
    const response = await api.patch<Restaurante>(endpoints.admin.alternarRestaurante(id));
    return response.data;
  },

  async deletarRestaurante(id: number) {
    await api.delete<void>(endpoints.admin.deletarRestaurante(id));
  },
};
