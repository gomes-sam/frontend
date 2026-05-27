import type {
  AuthResponse,
  CategoriaRestaurante,
  FormaPagamento,
  Pedido,
  Restaurante,
  TipoUsuario,
  Usuario,
  MenuItem,
  Funcionario,
} from "../types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const nextId = <T extends { id: number }>(items: T[]) => (items.length === 0 ? 1 : Math.max(...items.map((item) => item.id)) + 1);
type MockMenuItem = MenuItem & { restauranteId: number };
type MockPedido = Pedido & { clienteId: number };
type MockFuncionario = Funcionario & { restauranteId: number };

const mockUsers: Usuario[] = [
  { id: 1, nome: "Ana Silva", email: "cliente@boiaaqui.com", cpf: "123.456.789-00", telefone: "(11) 98765-4321", tipo: "CLIENTE", ativo: true, senha: "Senha123" },
  { id: 2, nome: "Restaurante Bom Sabor", email: "restaurante@boiaaqui.com", tipo: "RESTAURANTE", ativo: true, senha: "Senha123", telefone: "(11) 3333-4444", cpf: "" },
  { id: 3, nome: "Funcionario Cozinha", email: "funcionario@boiaaqui.com", tipo: "FUNCIONARIO", ativo: true, senha: "Senha123", telefone: "(11) 99999-0000", cpf: "" },
  { id: 4, nome: "Administrador Boia", email: "admin@boiaaqui.com", tipo: "ADMIN", ativo: true, senha: "Senha123" },
];

const mockRestaurants: Restaurante[] = [
  {
    id: 1,
    nomeFantasia: "Cantina da Gabi",
    descricao: "Pizzas artesanais, massas e pratos leves.",
    categoria: "PIZZARIA",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 4000-1000",
    fotoCapa: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    logo: "",
    taxaEntrega: 9.9,
    tempoPedidoMin: 35,
    tempoPedidoMax: 45,
    aberto: true,
    ativo: true,
  },
  {
    id: 2,
    nomeFantasia: "Hambúrguer do Chef",
    descricao: "Hambúrguer premium com ingredientes selecionados.",
    categoria: "HAMBURGUERIA",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 5000-2222",
    fotoCapa: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    logo: "",
    taxaEntrega: 7.5,
    tempoPedidoMin: 25,
    tempoPedidoMax: 35,
    aberto: true,
    ativo: true,
  },
  {
    id: 3,
    nomeFantasia: "Temaki Express",
    descricao: "Comida japonesa rápida e fresca para toda a família.",
    categoria: "JAPONESA",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 6000-3333",
    fotoCapa: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80",
    logo: "",
    taxaEntrega: 8.5,
    tempoPedidoMin: 20,
    tempoPedidoMax: 30,
    aberto: false,
    ativo: true,
  },
];

const mockMenuItems: MockMenuItem[] = [
  { id: 1, restauranteId: 1, nome: "Pizza Margherita", descricao: "Molho de tomate, muçarela e manjericão.", preco: 49.9, disponivel: true, foto: "", categoria: "PIZZARIA" },
  { id: 2, restauranteId: 1, nome: "Pizza Calabresa", descricao: "Calabresa fatiada e cebola caramelizada.", preco: 54.9, disponivel: true, foto: "", categoria: "PIZZARIA" },
  { id: 3, restauranteId: 2, nome: "Burger Clássico", descricao: "Carne bovina, queijo e molho especial.", preco: 34.9, disponivel: true, foto: "", categoria: "HAMBURGUERIA" },
  { id: 4, restauranteId: 2, nome: "Burger Veggie", descricao: "Hambúrguer de grãos com guacamole.", preco: 39.9, disponivel: true, foto: "", categoria: "HAMBURGUERIA" },
  { id: 5, restauranteId: 3, nome: "Temaki Salmão", descricao: "Salmão fresco com arroz temperado.", preco: 29.9, disponivel: true, foto: "", categoria: "JAPONESA" },
  { id: 6, restauranteId: 3, nome: "Uramaki Tradicional", descricao: "Arroz por fora com molho tarê.", preco: 35.9, disponivel: false, foto: "", categoria: "JAPONESA" },
];

const mockOrders: MockPedido[] = [
  {
    id: 1,
    clienteId: 1,
    restauranteId: 1,
    nomeRestaurante: "Cantina da Gabi",
    itens: [
      { menuItemId: 1, nomeItem: "Pizza Margherita", quantidade: 1, precoUnitario: 49.9, subtotal: 49.9 },
      { menuItemId: 2, nomeItem: "Pizza Calabresa", quantidade: 1, precoUnitario: 54.9, subtotal: 54.9 },
    ],
    status: "ENTREGUE",
    formaPagamento: "PIX",
    statusPagamento: "APROVADO",
    subtotal: 104.8,
    taxaEntrega: 9.9,
    total: 114.7,
    enderecoEntrega: "Av. Paulista, 1000",
    observacao: "Por favor, sem cebola.",
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 2,
    clienteId: 1,
    restauranteId: 2,
    nomeRestaurante: "Hambúrguer do Chef",
    itens: [
      { menuItemId: 3, nomeItem: "Burger Clássico", quantidade: 2, precoUnitario: 34.9, subtotal: 69.8 },
    ],
    status: "EM_PREPARO",
    formaPagamento: "CREDITO",
    statusPagamento: "PENDENTE",
    subtotal: 69.8,
    taxaEntrega: 7.5,
    total: 77.3,
    enderecoEntrega: "Rua dos Pinheiros, 345",
    observacao: "Molho à parte.",
    criadoEm: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
];

const mockEmployees: MockFuncionario[] = [
  { id: 1, usuarioId: 3, nome: "João Cozinha", email: "joao@boiaaqui.com", cpf: "111.222.333-44", telefone: "(11) 99876-5432", cargo: "Cozinheiro", setor: "Cozinha", ativo: true, restauranteId: 2 },
  { id: 2, usuarioId: 5, nome: "Maria Salão", email: "maria@boiaaqui.com", cpf: "555.666.777-88", telefone: "(11) 98877-6655", cargo: "Garçom", setor: "Salão", ativo: true, restauranteId: 2 },
];

export async function mockLogin(dados: { email: string; senha: string }): Promise<AuthResponse> {
  await delay();
  const usuario = mockUsers.find((user) => user.email.toLowerCase() === dados.email.toLowerCase() && user.senha === dados.senha);
  if (!usuario || !usuario.ativo) {
    throw new Error("E-mail ou senha incorretos.");
  }
  return {
    token: `mock-token-${usuario.id}`,
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
  };
}

export async function mockRegister(dados: {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
  tipo: TipoUsuario;
}): Promise<AuthResponse> {
  await delay();
  const existente = mockUsers.some((user) => user.email.toLowerCase() === dados.email.toLowerCase());
  if (existente) {
    throw new Error("Já existe uma conta com este e-mail.");
  }
  const novo: Usuario = {
    id: nextId(mockUsers),
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    tipo: dados.tipo,
    ativo: true,
    cpf: dados.cpf,
    telefone: dados.telefone,
  };
  mockUsers.push(novo);
  return {
    token: `mock-token-${novo.id}`,
    id: novo.id,
    nome: novo.nome,
    email: novo.email,
    tipo: novo.tipo,
  };
}

export async function mockGetUserById(id: number): Promise<Usuario> {
  await delay();
  const usuario = mockUsers.find((item) => item.id === id);
  if (!usuario) throw new Error("Usuário não encontrado.");
  return { ...usuario };
}

export async function mockUpdateUser(id: number, dados: Partial<Usuario>): Promise<Usuario> {
  await delay();
  const index = mockUsers.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Usuário não encontrado.");
  mockUsers[index] = { ...mockUsers[index], ...dados };
  return { ...mockUsers[index] };
}

export async function mockDeleteUser(id: number): Promise<void> {
  await delay();
  const index = mockUsers.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Usuário não encontrado.");
  mockUsers.splice(index, 1);
}

export async function mockListRestaurants(): Promise<Restaurante[]> {
  await delay();
  return mockRestaurants.filter((restaurant) => restaurant.ativo);
}

export async function mockSearchRestaurants(termo: string): Promise<Restaurante[]> {
  await delay();
  const busca = termo.trim().toLowerCase();
  return mockRestaurants.filter((restaurant) => {
    return (
      restaurant.ativo &&
      (restaurant.nomeFantasia.toLowerCase().includes(busca) || restaurant.categoria.toLowerCase().includes(busca) || (restaurant.cidade ?? "").toLowerCase().includes(busca))
    );
  });
}

export async function mockListRestaurantsByCategory(categoria: CategoriaRestaurante): Promise<Restaurante[]> {
  await delay();
  return mockRestaurants.filter((restaurant) => restaurant.ativo && restaurant.categoria === categoria);
}

export async function mockGetRestaurantById(id: number): Promise<Restaurante> {
  await delay();
  const restaurant = mockRestaurants.find((item) => item.id === id && item.ativo);
  if (!restaurant) throw new Error("Restaurante não encontrado.");
  return { ...restaurant };
}

export async function mockListMenuItemsByRestaurant(restauranteId: number): Promise<MenuItem[]> {
  await delay();
  return mockMenuItems.filter((item) => item.restauranteId === restauranteId);
}

export async function mockCreateMenuItem(restauranteId: number, item: Omit<MenuItem, "id">): Promise<MenuItem> {
  await delay();
  const novoItem: MockMenuItem = {
    id: nextId(mockMenuItems),
    restauranteId,
    ...item,
  };
  mockMenuItems.push(novoItem);
  return novoItem;
}

export async function mockUpdateMenuItem(itemId: number, dados: Partial<MenuItem>): Promise<MenuItem> {
  await delay();
  const index = mockMenuItems.findIndex((item) => item.id === itemId);
  if (index === -1) throw new Error("Item não encontrado.");
  mockMenuItems[index] = { ...mockMenuItems[index], ...dados };
  return { ...mockMenuItems[index] };
}

export async function mockDeleteMenuItem(itemId: number): Promise<void> {
  await delay();
  const index = mockMenuItems.findIndex((item) => item.id === itemId);
  if (index === -1) throw new Error("Item não encontrado.");
  mockMenuItems.splice(index, 1);
}

export async function mockListOrdersByClienteId(clienteId: number): Promise<Pedido[]> {
  await delay();
  return mockOrders.filter((order) => order.clienteId === clienteId);
}

export async function mockGetOrderById(id: number): Promise<Pedido> {
  await delay();
  const order = mockOrders.find((item) => item.id === id);
  if (!order) throw new Error("Pedido não encontrado.");
  return { ...order };
}

export async function mockCreateOrder(clienteId: number, pedidoDados: {
  restauranteId: number;
  itens: Array<{ menuItemId: number; quantidade: number }>;
  formaPagamento: FormaPagamento;
  enderecoEntrega: string;
  observacao?: string;
}): Promise<Pedido> {
  await delay();
  const restaurante = mockRestaurants.find((rest) => rest.id === pedidoDados.restauranteId);
  if (!restaurante) throw new Error("Restaurante não encontrado.");
  const itens = pedidoDados.itens.map((item) => {
    const menuItem = mockMenuItems.find((menu) => menu.id === item.menuItemId && menu.restauranteId === pedidoDados.restauranteId);
    if (!menuItem) throw new Error("Item do cardápio não encontrado.");
    return {
      menuItemId: menuItem.id,
      nomeItem: menuItem.nome,
      quantidade: item.quantidade,
      precoUnitario: menuItem.preco,
      subtotal: Number((menuItem.preco * item.quantidade).toFixed(2)),
    };
  });
  const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
  const taxaEntrega = restaurante.taxaEntrega ?? 0;
  const total = Number((subtotal + taxaEntrega).toFixed(2));
  const novoPedido: MockPedido = {
    id: nextId(mockOrders),
    clienteId,
    restauranteId: restaurante.id,
    nomeRestaurante: restaurante.nomeFantasia,
    itens,
    status: "AGUARDANDO",
    formaPagamento: pedidoDados.formaPagamento,
    statusPagamento: "PENDENTE",
    subtotal,
    taxaEntrega,
    total,
    enderecoEntrega: pedidoDados.enderecoEntrega,
    observacao: pedidoDados.observacao ?? "",
    criadoEm: new Date().toISOString(),
  };
  mockOrders.push(novoPedido);
  return novoPedido;
}

export async function mockListOrdersByRestaurantId(restauranteId: number): Promise<Pedido[]> {
  await delay();
  return mockOrders.filter((order) => order.restauranteId === restauranteId);
}

export async function mockListEmployees(restauranteId: number): Promise<Funcionario[]> {
  await delay();
  return mockEmployees.filter((item) => item.restauranteId === restauranteId);
}

export async function mockCreateEmployee(restauranteId: number, dados: Omit<Funcionario, "id">): Promise<Funcionario> {
  await delay();
  const novo: MockFuncionario = {
    id: nextId(mockEmployees),
    restauranteId,
    ...dados,
  };
  mockEmployees.push(novo);
  return novo;
}

export async function mockUpdateEmployee(id: number, dados: Partial<Funcionario>): Promise<Funcionario> {
  await delay();
  const index = mockEmployees.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Funcionário não encontrado.");
  mockEmployees[index] = { ...mockEmployees[index], ...dados };
  return { ...mockEmployees[index] };
}

export async function mockDeleteEmployee(id: number): Promise<void> {
  await delay();
  const index = mockEmployees.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Funcionário não encontrado.");
  mockEmployees.splice(index, 1);
}

export async function mockListAllUsers(): Promise<Usuario[]> {
  await delay();
  return [...mockUsers];
}

export async function mockListClients(): Promise<Usuario[]> {
  await delay();
  return mockUsers.filter((user) => user.tipo === "CLIENTE");
}

export async function mockListRestaurantsAdmin(): Promise<Restaurante[]> {
  await delay();
  return [...mockRestaurants];
}

export async function mockToggleUserActive(id: number): Promise<Usuario> {
  await delay();
  const index = mockUsers.findIndex((user) => user.id === id);
  if (index === -1) throw new Error("Usuário não encontrado.");
  mockUsers[index].ativo = !mockUsers[index].ativo;
  return { ...mockUsers[index] };
}

export async function mockToggleRestaurantActive(id: number): Promise<Restaurante> {
  await delay();
  const index = mockRestaurants.findIndex((restaurant) => restaurant.id === id);
  if (index === -1) throw new Error("Restaurante não encontrado.");
  mockRestaurants[index].ativo = !mockRestaurants[index].ativo;
  return { ...mockRestaurants[index] };
}

export async function mockDeleteRestaurant(id: number): Promise<void> {
  await delay();
  const index = mockRestaurants.findIndex((restaurant) => restaurant.id === id);
  if (index === -1) throw new Error("Restaurante não encontrado.");
  mockRestaurants.splice(index, 1);
}
