import { api } from "./api";

export const productService = {
  async listar() {
    return api.get("/restaurante/cardapio/listar");
  },

  async adicionar(data: FormData) {
    return api.post("/restaurante/cardapio/adicionar", data);
  },

  async atualizar(id: number, data: FormData) {
    return api.put(
      `/restaurante/cardapio/atualizar/item/${id}`,
      data
    );
  },

  async deletar(id: number) {
    return api.delete(
      `/restaurante/cardapio/deletar/${id}`
    );
  },

  async alternarDisponibilidade(id: number) {
    return api.patch(
      `/restaurante/cardapio/alternar/${id}/disponibilidade`
    );
  },
};