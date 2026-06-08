import { api } from "./api";
import { endpoints } from "./endpoints";
import type {
  CategoriaRestaurante,
  MenuItem,
  Restaurante,
} from "../types";

export const restaurantService = {
  async listar() {
    const response = await api.get<Restaurante[]>(
      endpoints.restaurantes.listar
    );
    return response.data;
  },

  async buscar(termo: string) {
    const response = await api.get<Restaurante[]>(
      endpoints.restaurantes.buscar,
      {
        params: { termo },
      }
    );
    return response.data;
  },

  async buscarPorCategoria(categoria: CategoriaRestaurante) {
    const response = await api.get<Restaurante[]>(
      endpoints.restaurantes.porCategoria(categoria)
    );
    return response.data;
  },

  async buscarPorId(id: number) {
    const response = await api.get<Restaurante>(
      endpoints.restaurantes.buscarPorId(id)
    );
    return response.data;
  },

  async buscarCardapio(id: number) {
    const response = await api.get<MenuItem[]>(
      endpoints.restaurantes.cardapio(id)
    );
    return response.data;
  },

  // NOVO MÉTODO
  async meuRestaurante() {
    const response = await api.get<Restaurante>(
      endpoints.restaurantes.me
    );
    return response.data;
  },
};