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

export type FormaPagamento =
  | "DEBITO"
  | "CREDITO"
  | "PIX"
  | "DINHEIRO";
export type StatusPedido =
  | "AGUARDANDO"
  | "ACEITO"
  | "EM_PREPARO"
  | "PRONTO"
  | "A_CAMINHO"
  | "ENTREGUE"
  | "CANCELADO"
  | "RECUSADO";
export type StatusPagamento =
  | "PENDENTE"
  | "APROVADO"
  | "RECUSADO"
  | "ESTORNADO";

export interface GrantedAuthority {
  authority: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
  tipo: TipoUsuario;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  cpf?: string;
  telefone?: string;
  fotoPerfil?: string;
  tipo: TipoUsuario;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
  enabled?: boolean;
  authorities?: GrantedAuthority[];
  username?: string;
  credentialsNonExpired?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  password?: string;
}

export interface Restaurante {
  id: number;
  usuario?: unknown;
  nomeFantasia: string;
  descricao?: string;
  categoria: CategoriaRestaurante;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  fotoCapa?: string;
  logo?: string;
  taxaEntrega?: number;
  tempoPedidoMin?: number;
  tempoPedidoMax?: number;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  aberto: boolean;
  ativo: boolean;
  criadoEm?: string;
  cardapio?: MenuItem[];
}

export interface MenuItem {
  id: number;
  restaurante?: unknown;
  nome: string;
  descricao?: string;
  preco: number;
  foto?: string;
  categoria?: string;
  disponivel: boolean;
}

export interface PedidoItemRequest {
  menuItemId: number;
  quantidade: number;
}

export interface PedidoRequest {
  restauranteId: number;
  itens: PedidoItemRequest[];
  formaPagamento: FormaPagamento;
  enderecoEntrega?: string;
  observacao?: string;
}

export interface PedidoItem {
  menuItemId: number;
  nomeItem: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  restauranteId: number;
  nomeRestaurante: string;
  itens: PedidoItem[];
  status: StatusPedido;
  formaPagamento: FormaPagamento;
  statusPagamento: StatusPagamento;
  subtotal: number;
  taxaEntrega: number;
  total: number;
  enderecoEntrega: string;
  observacao?: string;
  motivoRecusa?: string;
  criadoEm: string;
}

export interface AtualizarStatusRequest {
  status: StatusPedido;
  motivoRecusa?: string;
}

export interface FuncionarioRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone?: string;
  cargo: string;
  setor: string;
}

export interface Funcionario {
  id: number;
  usuarioId: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  cargo: string;
  setor: string;
  fotoPerfil?: string;
  ativo: boolean;
}

export interface SortObject {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface SpringPageResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  pageable?: PageableObject;
  empty?: boolean;
}
