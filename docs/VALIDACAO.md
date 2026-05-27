# Validação e Diagnóstico

## Escopo Validado

Contrato consultado no backend local em 26 de maio de 2026:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `GET http://localhost:8080/v3/api-docs`

O frontend foi corrigido para os enums e formatos efetivamente expostos pelo Swagger, especialmente status de pedido, formas de pagamento e requisições multipart.

## Testes do Frontend

| Teste | Resultado |
| --- | --- |
| `npm run lint` | aprovado |
| `npm run build` | aprovado |
| `git diff --check` | aprovado |
| varredura de chamadas HTTP diretas nas páginas | nenhuma chamada de domínio restante; uso centralizado nos services |
| proxy Vite `GET /restaurantes/listar` | resposta encaminhada com sucesso ao backend |

O asset pesado da tela de cadastro foi substituído pelo asset otimizado utilizado no login, removendo aproximadamente `2,93 MB` do bundle gerado.

## Testes de Integração Executados

| Fluxo | Resultado observado |
| --- | --- |
| `GET /restaurantes/listar` sem autenticação | `200`, lista retornada |
| `GET /pedidos/listar` sem autenticação | `403`, proteção ativa |
| cadastro e login de usuários de teste | `200`, JWT recebido |
| listagem admin de usuários/restaurantes paginada | `200` |
| filtro admin `tipo=CLIENTE` | `200` |
| ativar/desativar cliente por admin | `200` |
| exclusão dos usuários criados no teste | `204` |
| listagem de pedidos por cliente autenticado | `200` |
| criação de pedido com restaurante inexistente | requisição aceita no formato correto e rejeitada pela regra de negócio |
| pagamento obsoleto `CARTAO_CREDITO` | rejeitado pelo backend, confirmando uso necessário de `CREDITO` |

## Limitações Confirmadas no Backend

Estas ocorrências impedem declarar todos os fluxos como plenamente utilizáveis apenas com ajustes no frontend:

| Fluxo | Resposta do backend | Consequência |
| --- | --- | --- |
| usuário recém-cadastrado como `RESTAURANTE` acessa cardápio ou pedidos | `400` com `Restaurante nao encontrado` | não existe restaurante associado ao usuário após o cadastro |
| mesmo restaurante tenta adicionar item no formato do Swagger | `400` com `Restaurante nao encontrado` | gestão de cardápio depende da associação ausente |
| restaurante autenticado tenta criar funcionário com multipart correto | `403` | autorização/regra de segurança bloqueia o fluxo |

Para tornar estes fluxos operacionais, o backend precisa criar ou associar uma entidade `Restaurante` ao cadastro do perfil correspondente e liberar a autorização prevista para funcionários.

## Checklist de Revalidação Após Correção do Backend

1. Cadastrar restaurante e confirmar criação automática da entidade de restaurante.
2. Criar, editar, alternar disponibilidade e excluir item do cardápio com e sem foto.
3. Cadastrar e editar funcionário via multipart.
4. Cadastrar cliente, efetuar pedido real e validar seus totais.
5. Alterar status do pedido até `ENTREGUE` e testar `RECUSADO` com motivo.
6. Alternar loja aberta/fechada e conferir exibição na home pública.
7. Exercitar operações administrativas de ativação e exclusão.

