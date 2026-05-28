import type { FormaPagamento, StatusPedido, TipoUsuario } from "../types";

export function formatarMoeda(value: number) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarData(value?: string) {
  return value ? new Date(value).toLocaleDateString("pt-BR") : "-";
}

export function formatarHora(value?: string) {
  return value
    ? new Date(value).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "-";
}

export function limparMascara(value: string) {
  return value.replace(/\D/g, "");
}

export function traduzirStatusPedido(status: StatusPedido) {
  return ({
    AGUARDANDO: "Aguardando",
    ACEITO: "Aceito",
    EM_PREPARO: "Em preparo",
    PRONTO: "Pronto",
    A_CAMINHO: "A caminho",
    ENTREGUE: "Entregue",
    RECUSADO: "Recusado",
    CANCELADO: "Cancelado",
  } as Record<StatusPedido, string>)[status];
}

export function traduzirTipoUsuario(tipo: TipoUsuario) {
  return ({
    CLIENTE: "Cliente",
    RESTAURANTE: "Restaurante",
    FUNCIONARIO: "Funcionario",
    ADMIN: "Administrador",
  } as Record<TipoUsuario, string>)[tipo];
}

export function traduzirFormaPagamento(forma: FormaPagamento) {
  return ({ DEBITO: "Debito", CREDITO: "Credito", PIX: "PIX", DINHEIRO: "Dinheiro" } as Record<FormaPagamento, string>)[forma];
}
