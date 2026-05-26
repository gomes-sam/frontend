import { api } from "./api";

export const orderService = {
  async criar<T = unknown>(data: T) {
    return api.post("/pedidos/criar", data);
  },

  async listar() {
    return api.get("/pedidos/listar");
  },

  async buscar(id: number) {
    return api.get(`/pedidos/buscar/${id}`);
  },

  async listarPedidosRestaurante() {
    return api.get("/restaurante/pedidos/listar");
  },

  async atualizarStatus(id: number, status: string) {
    return api.patch(
      `/restaurante/pedidos/atualizar/${id}/status`,
      { status }
    );
  },
};