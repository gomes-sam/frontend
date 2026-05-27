import { api } from "./api";
import { endpoints } from "./endpoints";
import type { MenuItem } from "../types";

export interface MenuItemPayload {
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
  foto?: File | null;
}

function criarMultipart(foto?: File | null) {
  const formData = new FormData();
  if (foto) {
    formData.append("foto", foto);
  }
  return formData;
}

export const productService = {
  async listar() {
    const response = await api.get<MenuItem[]>(endpoints.restaurante.cardapio.listar);
    return response.data;
  },
  async adicionar({ foto, ...params }: MenuItemPayload) {
    const response = await api.post<MenuItem>(
      endpoints.restaurante.cardapio.adicionar,
      criarMultipart(foto),
      { params }
    );
    return response.data;
  },
  async atualizar(id: number, { foto, ...params }: MenuItemPayload) {
    const response = await api.put<MenuItem>(
      endpoints.restaurante.cardapio.atualizar(id),
      criarMultipart(foto),
      { params }
    );
    return response.data;
  },
  async deletar(id: number) {
    await api.delete<void>(endpoints.restaurante.cardapio.deletar(id));
  },
  async alternarDisponibilidade(id: number) {
    const response = await api.patch<MenuItem>(
      endpoints.restaurante.cardapio.alternarDisponibilidade(id)
    );
    return response.data;
  },
};
