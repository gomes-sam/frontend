export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  restaurantes: {
    listar: "/restaurantes/listar",
    buscar: "/restaurantes/buscar",
    buscarPorId: (id: number) => `/restaurantes/buscar/${id}`,
    cardapio: (id: number) => `/restaurantes/buscar/${id}/cardapio`,
    porCategoria: (categoria: string) =>
      `/restaurantes/buscar/categoria/${categoria}`,
  },
  pedidos: {
    criar: "/pedidos/criar",
    listar: "/pedidos/listar",
    buscar: (id: number) => `/pedidos/buscar/${id}`,
  },
  restaurante: {
    pedidos: {
      listar: "/restaurante/pedidos/listar",
      atualizarStatus: (id: number) =>
        `/restaurante/pedidos/atualizar/${id}/status`,
      alternarAberto: "/restaurante/pedidos/alternar/aberto",
    },
    cardapio: {
      listar: "/restaurante/cardapio/listar",
      adicionar: "/restaurante/cardapio/adicionar",
      atualizar: (id: number) => `/restaurante/cardapio/atualizar/item/${id}`,
      deletar: (id: number) => `/restaurante/cardapio/deletar/${id}`,
      alternarDisponibilidade: (id: number) =>
        `/restaurante/cardapio/alternar/${id}/disponibilidade`,
    },
  },
  funcionarios: {
    listar: "/funcionarios/listar",
    buscar: (id: number) => `/funcionarios/buscar/${id}`,
    criar: "/funcionarios/criar",
    atualizar: (id: number) => `/funcionarios/atualizar/${id}`,
    deletar: (id: number) => `/funcionarios/deletar/${id}`,
  },
  admin: {
    usuarios: "/admin/listar/usuarios",
    restaurantes: "/admin/listar/restaurantes",
    alternarUsuario: (id: number) => `/admin/buscar/usuarios/${id}/ativo`,
    deletarUsuario: (id: number) => `/admin/deletar/usuarios/${id}`,
    alternarRestaurante: (id: number) =>
      `/admin/atualizar/restaurantes/${id}/ativo`,
    deletarRestaurante: (id: number) =>
      `/admin/deletar/restaurantes/${id}`,
  },
} as const;
