import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BotaoVoltar from "../../components/common/BotaoVoltar";
import RestauranteNaoVinculado from "../../components/common/RestauranteNaoVinculado";
import {
  Button,
  Card,
  EmptyState,
  Loading,
  PageHeader,
  StatusBadge,
} from "../../components/common/ui";
import { resolveAssetUrl } from "../../services/api";
import {
  getApiErrorMessage,
  isRestaurantNotLinkedError,
} from "../../services/error";
import { productService } from "../../services/productService";
import { restaurantService } from "../../services/restaurantService";
import type { MenuItem, Restaurante } from "../../types";
import { formatarMoeda } from "../../utils/formatters";

export default function MeuRestaurante() {
  const navigate = useNavigate();

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [itens, setItens] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [semRestaurante, setSemRestaurante] = useState(false);

  async function carregar() {
    setLoading(true);
    setErro("");
    setSemRestaurante(false);

    try {
      const restauranteLogado = await restaurantService.meuRestaurante();
      setRestaurante(restauranteLogado);

      try {
        const cardapio = await productService.listar();
        setItens(Array.isArray(cardapio) ? cardapio : []);
      } catch {
        setItens([]);
      }
    } catch (error) {
      setRestaurante(null);
      setItens([]);

      if (isRestaurantNotLinkedError(error)) {
        setSemRestaurante(true);
        return;
      }

      setErro(
        getApiErrorMessage(
          error,
          "Não foi possível carregar os dados do restaurante vinculado."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (semRestaurante) {
    return <RestauranteNaoVinculado retry={carregar} />;
  }

  const endereco = restaurante
    ? [
        restaurante.logradouro,
        restaurante.numero,
        restaurante.bairro,
        restaurante.cidade,
        restaurante.estado,
        restaurante.cep,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <section className="mx-auto max-w-6xl">
      <BotaoVoltar className="mb-5" />

      <PageHeader
        title="Meu restaurante"
        description="Dados do restaurante vinculado ao usuário logado."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => navigate("/restaurante/painel")}
            >
              Ir para painel
            </Button>

            <Button onClick={() => navigate("/restaurante/cardapio")}>
              Ir para cardápio
            </Button>
          </>
        }
      />

      {loading ? (
        <Loading label="Carregando restaurante vinculado..." />
      ) : erro ? (
        <EmptyState
          title="Não foi possível carregar os dados do restaurante vinculado."
          description={erro}
          action={<Button onClick={carregar}>Tentar novamente</Button>}
        />
      ) : !restaurante ? (
        <EmptyState
          title="Dados do restaurante indisponíveis"
          description="O backend respondeu, mas não retornou um restaurante vinculado para este usuário."
          action={
            <Button onClick={() => navigate("/restaurante/cardapio")}>
              Ver cardápio
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="overflow-hidden p-0">
            <div className="h-52 bg-orange-100">
              {restaurante.fotoCapa ? (
                <img
                  src={resolveAssetUrl(restaurante.fotoCapa)}
                  alt={restaurante.nomeFantasia}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl font-black text-[#E8442A]">
                  BoiaAqui
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {restaurante.nomeFantasia || "Restaurante"}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    {restaurante.descricao || "Sem descrição cadastrada."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    value={restaurante.aberto ? "Aberto" : "Fechado"}
                  />
                  <StatusBadge
                    value={restaurante.ativo ? "Ativo" : "Inativo"}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Info
                  label="Categoria"
                  value={restaurante.categoria || "Sem categoria"}
                />

                <Info
                  label="Telefone"
                  value={restaurante.telefone || "Não informado"}
                />

                <Info
                  label="Endereço"
                  value={endereco || "Não informado"}
                  wide
                />

                <Info
                  label="Taxa de entrega"
                  value={formatarMoeda(restaurante.taxaEntrega ?? 0)}
                />

                <Info
                  label="Tempo estimado"
                  value={`${restaurante.tempoPedidoMin ?? "-"} a ${
                    restaurante.tempoPedidoMax ?? "-"
                  } min`}
                />

                <Info
                  label="Avaliação"
                  value={`${Number(restaurante.avaliacaoMedia ?? 0).toFixed(
                    1
                  )} (${restaurante.totalAvaliacoes ?? 0} avaliações)`}
                />
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <p className="text-sm font-bold text-slate-500">
                Itens no cardápio
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {itens.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Carregados via endpoint protegido do cardápio.
              </p>
            </Card>

            <Card>
              <p className="text-sm font-bold text-slate-500">Disponíveis</p>
              <p className="mt-2 text-3xl font-black text-[#E8442A]">
                {itens.filter((item) => item.disponivel !== false).length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Use o cardápio para editar disponibilidade.
              </p>
            </Card>

            <Card>
              <p className="text-sm font-bold text-slate-500">Edição</p>
              <p className="mt-2 text-sm text-slate-500">
                Esta tela é somente leitura porque o backend atual não possui
                endpoint público de atualização do restaurante vinculado.
              </p>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}

function Info({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}