import { api } from "./api";
import type { Funcionario } from "../types";

export const employeeService = {
  listar: () => api.get<Funcionario[]>("/funcionarios/listar"),
  cadastrar: (dados: FormData) => api.post<Funcionario>("/funcionarios/criar", dados),
  editar: (id: number, dados: FormData) => api.put<Funcionario>(`/funcionarios/atualizar/${id}`, dados),
  deletar: (id: number) => api.delete<void>(`/funcionarios/deletar/${id}`),
};
