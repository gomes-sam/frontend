export type TipoUsuario = "CLIENTE" | "RESTAURANTE" | "FUNCIONARIO" | "ADMIN";
export type CategoriaRestaurante =
  | "PIZZARIA"
  | "HAMBURGUERIA"
  | "JAPONESA"
  | "BRASILEIRA"
  | "ITALIANA"
  | "MEXICANA"
  | "SAUDAVEL"
  | "DOCERIA"
  | "OUTROS";

export type FormaPagamento = "PIX" | "DINHEIRO" | "CARTAO_CREDITO" | "CARTAO_DEBITO";
export type StatusPedido =
  | "PENDENTE"
  | "ACEITO"
  | "EM_PREPARO"
  | "PRONTO"
  | "A_CAMINHO"
  | "ENTREGUE"
  | "CANCELADO"
  | "RECUSADO";

export interface AuthResponse {
  token: string;
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  tipo: TipoUsuario;
  ativo: boolean;
  senha?: string;
}

export interface Restaurante {
  id: number;
  nomeFantasia: string;
  descricao?: string;
  categoria: CategoriaRestaurante;
  cidade?: string;
  estado?: string;
  telefone?: string;
  fotoCapa?: string;
  logo?: string;
  taxaEntrega?: number;
  tempoPedidoMin?: number;
  tempoPedidoMax?: number;
  avaliacaoMedia?: number;
  aberto: boolean;
  ativo: boolean;
}

export interface MenuItem {
  id: number;
  restauranteId: number;
  nome: string;
  descricao?: string;
  preco: number;
  disponivel: boolean;
  imagemUrl?: string;
  categoria?: string;
}

export interface PedidoItem {
  menuItemId: number;
  nomeItem: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  imagemUrl?: string;
}

export interface Pedido {
  id: number;
  clienteId: number;
  restauranteId: number;
  nomeRestaurante: string;
  itens: PedidoItem[];
  status: StatusPedido;
  formaPagamento: FormaPagamento;
  subtotal: number;
  taxaEntrega: number;
  total: number;
  enderecoEntrega: string;
  observacao?: string;
  criadoEm: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  cargo: string;
  setor: string;
  fotoPerfil?: string;
  ativo: boolean;
  restauranteId: number;
}

export interface SpringPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
