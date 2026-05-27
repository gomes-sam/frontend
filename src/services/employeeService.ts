import { api } from "./api";
import { endpoints } from "./endpoints";
import type { Funcionario, FuncionarioRequest } from "../types";

export const employeeService = {
  async listar() {
    const response = await api.get<Funcionario[]>(endpoints.funcionarios.listar);
    return response.data;
  },
  async buscar(id: number) {
    const response = await api.get<Funcionario>(endpoints.funcionarios.buscar(id));
    return response.data;
  },
  async cadastrar(dados: FuncionarioRequest, foto?: File | null) {
    const response = await api.post<Funcionario>(
      endpoints.funcionarios.criar,
      criarFuncionarioMultipart(dados, foto)
    );
    return response.data;
  },
  async editar(id: number, dados: FuncionarioRequest, foto?: File | null) {
    const response = await api.put<Funcionario>(
      endpoints.funcionarios.atualizar(id),
      criarFuncionarioMultipart(dados, foto)
    );
    return response.data;
  },
  async deletar(id: number) {
    await api.delete<void>(endpoints.funcionarios.deletar(id));
  },
};

function criarFuncionarioMultipart(dados: FuncionarioRequest, foto?: File | null) {
  const formData = new FormData();
  formData.append("dados", new Blob([JSON.stringify(dados)], { type: "application/json" }));
  if (foto) {
    formData.append("foto", foto);
  }
  return formData;
}
