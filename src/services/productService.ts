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

function criarMultipart({ nome, descricao, preco, categoria, foto }: MenuItemPayload) {
  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("preco", String(preco));
  if (descricao) {
    formData.append("descricao", descricao);
  }
  if (categoria) {
    formData.append("categoria", categoria);
  }
  if (foto) {
    formData.append("foto", foto);
  }
  return formData;
}

export const productService = {
  async listar() {
    const response = await api.get<MenuItem[]>(endpoints.restaurante.cardapio.listar);
    if (!Array.isArray(response.data)) {
      throw new Error("Resposta invalida ao listar cardapio.");
    }
    return response.data;
  },
  async adicionar(payload: MenuItemPayload) {
    const response = await api.post<MenuItem>(
      endpoints.restaurante.cardapio.adicionar,
      criarMultipart(payload)
    );
    return response.data;
  },
  async atualizar(id: number, payload: MenuItemPayload) {
    const response = await api.put<MenuItem>(
      endpoints.restaurante.cardapio.atualizar(id),
      criarMultipart(payload)
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
