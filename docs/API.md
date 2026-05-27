# Contrato de API do Frontend

Este documento registra o contrato conferido no OpenAPI disponível em `http://localhost:8080/v3/api-docs` e seu mapeamento no frontend.

## Configuração HTTP

- Cliente Axios: `src/services/api.ts`
- Base URL opcional: `VITE_API_URL`
- Proxy de desenvolvimento: `vite.config.ts` para `http://localhost:8080`
- Autorização: header `Authorization: Bearer <token>` quando existe sessão
- Catálogo central de rotas: `src/services/endpoints.ts`

## Enums

| Tipo | Valores |
| --- | --- |
| `TipoUsuario` | `CLIENTE`, `FUNCIONARIO`, `ADMIN`, `RESTAURANTE` |
| `CategoriaRestaurante` | `PIZZARIA`, `HAMBURGUERIA`, `JAPONESA`, `BRASILEIRA`, `ITALIANA`, `MEXICANA`, `SAUDAVEL`, `DOCERIA`, `OUTROS` |
| `FormaPagamento` | `DEBITO`, `CREDITO`, `PIX`, `DINHEIRO` |
| `StatusPedido` | `AGUARDANDO`, `ACEITO`, `EM_PREPARO`, `PRONTO`, `A_CAMINHO`, `ENTREGUE`, `RECUSADO`, `CANCELADO` |
| `StatusPagamento` | `PENDENTE`, `APROVADO`, `RECUSADO`, `ESTORNADO` |

## Autenticação

| Método | Endpoint | Corpo | Resposta | Service |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/login` | `LoginRequest` | `AuthResponse` | `authService.login` |
| `POST` | `/auth/register` | `RegisterRequest` | `AuthResponse` | `authService.register` |

`LoginRequest` exige `email` e `senha`. `RegisterRequest` exige `nome`, `email`, `senha` e `tipo`, aceitando `cpf` e `telefone`.

## Consulta Pública de Restaurantes

| Método | Endpoint | Entrada | Resposta | Service |
| --- | --- | --- | --- | --- |
| `GET` | `/restaurantes/listar` | - | `Restaurante[]` | `restaurantService.listar` |
| `GET` | `/restaurantes/buscar` | query `termo` | `Restaurante[]` | `restaurantService.buscar` |
| `GET` | `/restaurantes/buscar/{id}` | path `id` | `Restaurante` | `restaurantService.buscarPorId` |
| `GET` | `/restaurantes/buscar/{id}/cardapio` | path `id` | `MenuItem[]` | `restaurantService.buscarCardapio` |
| `GET` | `/restaurantes/buscar/categoria/{categoria}` | path enum | `Restaurante[]` | `restaurantService.buscarPorCategoria` |

## Pedidos do Cliente

| Método | Endpoint | Entrada | Resposta | Service |
| --- | --- | --- | --- | --- |
| `POST` | `/pedidos/criar` | `PedidoRequest` | `PedidoResponse` | `orderService.criar` |
| `GET` | `/pedidos/listar` | - | `PedidoResponse[]` | `orderService.listar` |
| `GET` | `/pedidos/buscar/{id}` | path `id` | `PedidoResponse` | `orderService.buscar` |

Payload de criação:

```json
{
  "restauranteId": 1,
  "itens": [{ "menuItemId": 10, "quantidade": 2 }],
  "formaPagamento": "PIX",
  "enderecoEntrega": "Rua Exemplo, 100",
  "observacao": "Sem cebola"
}
```

## Operação do Restaurante

| Método | Endpoint | Entrada | Resposta | Service |
| --- | --- | --- | --- | --- |
| `GET` | `/restaurante/pedidos/listar` | query opcional `status` | `PedidoResponse[]` | `orderService.listarPedidosRestaurante` |
| `PATCH` | `/restaurante/pedidos/atualizar/{id}/status` | `AtualizarStatusRequest` | `PedidoResponse` | `orderService.atualizarStatus` |
| `PATCH` | `/restaurante/pedidos/alternar/aberto` | - | - | `orderService.alternarAberto` |

Ao enviar `status: "RECUSADO"`, a tela coleta `motivoRecusa` e o inclui no corpo.

## Cardápio

| Método | Endpoint | Formato | Service |
| --- | --- | --- | --- |
| `GET` | `/restaurante/cardapio/listar` | - | `productService.listar` |
| `POST` | `/restaurante/cardapio/adicionar` | query + multipart | `productService.adicionar` |
| `PUT` | `/restaurante/cardapio/atualizar/item/{id}` | query + multipart | `productService.atualizar` |
| `PATCH` | `/restaurante/cardapio/alternar/{id}/disponibilidade` | - | `productService.alternarDisponibilidade` |
| `DELETE` | `/restaurante/cardapio/deletar/{id}` | - | `productService.deletar` |

Em adicionar/atualizar, `nome` e `preco` são query params obrigatórios; `descricao` e `categoria` são opcionais. O arquivo opcional é enviado como part multipart `foto`.

## Funcionários

| Método | Endpoint | Formato | Service |
| --- | --- | --- | --- |
| `GET` | `/funcionarios/listar` | - | `employeeService.listar` |
| `GET` | `/funcionarios/buscar/{id}` | - | `employeeService.buscar` |
| `POST` | `/funcionarios/criar` | multipart | `employeeService.cadastrar` |
| `PUT` | `/funcionarios/atualizar/{id}` | multipart | `employeeService.editar` |
| `DELETE` | `/funcionarios/deletar/{id}` | - | `employeeService.deletar` |

Criação e atualização enviam multipart com:

- `dados`: blob `application/json` contendo `FuncionarioRequest`
- `foto`: arquivo opcional

Campos obrigatórios de `FuncionarioRequest`: `nome`, `email`, `senha`, `cpf`, `cargo` e `setor`.

## Administração

| Método | Endpoint | Entrada | Service |
| --- | --- | --- | --- |
| `GET` | `/admin/listar/usuarios` | `page`, `size`, `tipo` opcional | `adminService.listarUsuarios/listarClientes` |
| `PATCH` | `/admin/buscar/usuarios/{id}/ativo` | - | `adminService.ativarDesativarUsuario` |
| `DELETE` | `/admin/deletar/usuarios/{id}` | - | `adminService.deletarUsuario` |
| `GET` | `/admin/listar/restaurantes` | `page`, `size` | `adminService.listarRestaurantes` |
| `PATCH` | `/admin/atualizar/restaurantes/{id}/ativo` | - | `adminService.ativarDesativarRestaurante` |
| `DELETE` | `/admin/deletar/restaurantes/{id}` | - | `adminService.deletarRestaurante` |

