import { api } from "./api";

export const restaurantService = {
  async listar() {
    return api.get("/restaurantes/listar");
  },

  async buscarPorId(id: number) {
    return api.get(`/restaurantes/buscar/${id}`);
  },

  async buscarCardapio(id: number) {
    return api.get(`/restaurantes/buscar/${id}/cardapio`);
  },
};