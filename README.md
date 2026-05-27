# BoiaAqui Frontend

Interface web do BoiaAqui para clientes, restaurantes, funcionários e administradores. O projeto foi alinhado ao contrato OpenAPI exposto pelo backend em `http://localhost:8080/swagger-ui/index.html`.

## Estado Atual

O frontend consome os endpoints reais do Swagger por services tipados, mantém a sessão JWT em um único módulo, trata erros da API de forma padronizada e utiliza proxy do Vite no desenvolvimento.

Validações executadas:

- `npm run lint`
- `npm run build`
- consulta do OpenAPI em `GET /v3/api-docs`
- smoke test de rotas públicas e autenticação
- smoke test do proxy Vite para a API

Há limitações confirmadas no backend para o fluxo de restaurante; consulte [docs/VALIDACAO.md](docs/VALIDACAO.md).

## Tecnologias

- React 19 com TypeScript
- Vite 8
- React Router
- Axios
- Tailwind CSS
- ESLint

## Como Executar

Pré-requisitos:

- Node.js compatível com Vite 8
- backend iniciado em `http://localhost:8080`

Instalação e execução:

```bash
npm install
npm run dev
```

O frontend abre em `http://localhost:5174`. Durante o desenvolvimento, chamadas para `/auth`, `/restaurantes`, `/pedidos`, `/restaurante`, `/funcionarios` e `/admin` são encaminhadas ao backend local.

Para apontar diretamente para outra API, crie `.env.local`:

```env
VITE_API_URL=http://localhost:8080
```

Com `VITE_API_URL` vazio, o proxy do Vite é usado no modo desenvolvimento.

## Comandos

```bash
npm run dev       # servidor local
npm run lint      # análise estática
npm run build     # TypeScript + bundle de produção
npm run preview   # visualização do build
```

## Arquitetura

```text
src/
  components/        componentes de layout e navegação
  contexts/          estado de autenticação
  pages/             telas públicas, cliente, restaurante e admin
  services/
    api.ts           cliente Axios e URLs de arquivos
    endpoints.ts     catálogo único das rotas do Swagger
    error.ts         extração uniforme de erros HTTP
    session.ts       persistência e remoção da sessão JWT
    *Service.ts      operações por domínio
  types/index.ts     DTOs e enums do contrato da API
```

Princípios de consumo:

- Páginas não montam URLs de API nem usam Axios diretamente.
- Services devolvem DTOs prontos, não objetos `AxiosResponse`.
- Enums enviados ao backend correspondem exatamente ao OpenAPI.
- Uploads de cardápio e funcionários usam `multipart/form-data` conforme o Swagger.

## Rotas da Interface

| Rota | Perfil | Função |
| --- | --- | --- |
| `/` | Público | busca e listagem de restaurantes |
| `/login` | Público | autenticação |
| `/cadastro` | Público | cadastro de usuário |
| `/restaurante/:id` | Público/Cliente | cardápio e montagem do pedido |
| `/meus-pedidos` | Cliente | pedidos do usuário |
| `/pedido/:id` | Cliente | acompanhamento do pedido |
| `/meu-perfil` | Cliente | dados da sessão |
| `/restaurante/painel` | Restaurante/Funcionário | pedidos recebidos |
| `/restaurante/cardapio` | Restaurante/Funcionário | gestão de itens |
| `/restaurante/funcionarios` | Restaurante/Funcionário | gestão de equipe |
| `/admin/home` | Admin | indicadores e ações |
| `/admin/clientes` | Admin | gestão de clientes |
| `/admin/restaurantes` | Admin | gestão de restaurantes |

## Autenticação

`POST /auth/login` e `POST /auth/register` retornam `token`, `id`, `nome`, `email` e `tipo`. A sessão é salva no `localStorage` por [src/services/session.ts](src/services/session.ts), e o interceptor de [src/services/api.ts](src/services/api.ts) envia `Authorization: Bearer <token>`.

Perfis aceitos: `CLIENTE`, `FUNCIONARIO`, `ADMIN` e `RESTAURANTE`.

## Documentação Complementar

- [Contrato e mapeamento da API](docs/API.md)
- [Validação, testes e pendências do backend](docs/VALIDACAO.md)
