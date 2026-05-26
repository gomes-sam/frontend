import { api } from "./api";
import type { Restaurante, SpringPageResponse, Usuario } from "../types";

export const adminService = {
  listarUsuarios: (pagina = 0, tamanho = 20) => {
    return api.get<SpringPageResponse<Usuario>>("/admin/listar/usuarios", { params: { page: pagina, size: tamanho } });
  },

  listarClientes: (pagina = 0, tamanho = 20) => {
    return api.get<SpringPageResponse<Usuario>>("/admin/listar/usuarios", {
      params: { page: pagina, size: tamanho, tipo: "CLIENTE" },
    });
  },

  ativarDesativarUsuario: (id: number) => {
    return api.patch<Usuario>(`/admin/buscar/usuarios/${id}/ativo`);
  },

  deletarUsuario: (id: number) => {
    return api.delete<void>(`/admin/deletar/usuarios/${id}`);
  },

  listarRestaurantes: (pagina = 0, tamanho = 20) => {
    return api.get<SpringPageResponse<Restaurante>>("/admin/listar/restaurantes", { params: { page: pagina, size: tamanho } });
  },

  ativarDesativarRestaurante: (id: number) => {
    return api.patch<Restaurante>(`/admin/atualizar/restaurantes/${id}/ativo`);
  },

  deletarRestaurante: (id: number) => {
    return api.delete<void>(`/admin/deletar/restaurantes/${id}`);
  },
};
