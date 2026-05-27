import { api } from "./api";
import { endpoints } from "./endpoints";
import type { AtualizarStatusRequest, Pedido, PedidoRequest, StatusPedido } from "../types";

export const orderService = {
  async criar(data: PedidoRequest) {
    const response = await api.post<Pedido>(endpoints.pedidos.criar, data);
    return response.data;
  },
  async listar() {
    const response = await api.get<Pedido[]>(endpoints.pedidos.listar);
    return response.data;
  },
  async buscar(id: number) {
    const response = await api.get<Pedido>(endpoints.pedidos.buscar(id));
    return response.data;
  },
  async listarPedidosRestaurante(status?: StatusPedido) {
    const response = await api.get<Pedido[]>(endpoints.restaurante.pedidos.listar, {
      params: status ? { status } : undefined,
    });
    return response.data;
  },
  async atualizarStatus(id: number, data: AtualizarStatusRequest) {
    const response = await api.patch<Pedido>(
      endpoints.restaurante.pedidos.atualizarStatus(id),
      data
    );
    return response.data;
  },
  async alternarAberto() {
    await api.patch(endpoints.restaurante.pedidos.alternarAberto);
  },
};
