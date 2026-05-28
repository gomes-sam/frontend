import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestauranteNaoVinculado from "../../components/common/RestauranteNaoVinculado";
import { Button, Card, EmptyState, Loading, PageHeader, StatusBadge } from "../../components/common/ui";
import { getApiErrorMessage, isRestaurantNotLinkedError } from "../../services/error";
import { orderService } from "../../services/orderService";
import type { Pedido, StatusPedido } from "../../types";
import { formatarMoeda } from "../../utils/formatters";

const statusFinais: StatusPedido[] = ["ENTREGUE", "RECUSADO", "CANCELADO"];

export default function DashboardRestaurante() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [semRestaurante, setSemRestaurante] = useState(false);

  async function carregar() {
    setLoading(true);
    setErro("");
    setSemRestaurante(false);
    try {
      const lista = await orderService.listarPedidosRestaurante();
      setPedidos(Array.isArray(lista) ? lista : []);
    } catch (error) {
      setSemRestaurante(isRestaurantNotLinkedError(error));
      setErro(getApiErrorMessage(error, "Não foi possível carregar o dashboard."));
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (semRestaurante) return <RestauranteNaoVinculado retry={carregar} />;

  const recebidos = pedidos.length;
  const emAndamento = pedidos.filter((p) => !statusFinais.includes(p.status)).length;
  const entregues = pedidos.filter((p) => p.status === "ENTREGUE");
  const faturamento = entregues.reduce((value, p) => value + Number(p.total || 0), 0);
  const ticketMedio = entregues.length ? faturamento / entregues.length : 0;
  const porStatus = pedidos.reduce<Record<string, number>>((acc, pedido) => {
    acc[pedido.status] = (acc[pedido.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="mx-auto max-w-6xl">
      <PageHeader
        title="Dashboard Restaurante"
        description="Resumo operacional dos pedidos retornados pelo back-end."
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("/restaurante/meu-restaurante")}>Meu restaurante</Button>
            <Button onClick={carregar}>Atualizar</Button>
          </>
        }
      />

      {loading ? (
        <Loading label="Carregando indicadores..." />
      ) : erro ? (
        <EmptyState title="Não foi possível carregar o dashboard" description={erro} action={<Button onClick={carregar}>Tentar novamente</Button>} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Pedidos recebidos" value={String(recebidos)} />
            <Metric label="Em andamento" value={String(emAndamento)} />
            <Metric label="Faturamento entregue" value={formatarMoeda(faturamento)} />
            <Metric label="Ticket médio" value={formatarMoeda(ticketMedio)} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <h2 className="mb-4 text-lg font-black text-slate-900">Pedidos por status</h2>
              <div className="space-y-3">
                {Object.keys(porStatus).length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhum pedido recebido ainda.</p>
                ) : (
                  Object.entries(porStatus).map(([status, total]) => (
                    <div key={status} className="flex items-center justify-between gap-3">
                      <StatusBadge value={status as StatusPedido} type="pedido" />
                      <strong className="text-sm text-slate-800">{total}</strong>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">Últimos pedidos</h2>
                <Button variant="ghost" onClick={() => navigate("/restaurante/painel")}>Ver painel</Button>
              </div>
              {pedidos.length === 0 ? (
                <p className="text-sm text-slate-500">Os pedidos aparecerão aqui assim que forem feitos pelos clientes.</p>
              ) : (
                <div className="space-y-3">
                  {pedidos.slice(0, 5).map((pedido) => (
                    <button
                      key={pedido.id}
                      onClick={() => navigate(`/restaurante/pedidos/${pedido.id}`)}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3 text-left transition hover:border-[#E8442A] hover:bg-orange-50"
                    >
                      <div>
                        <p className="text-sm font-black text-slate-900">Pedido #{pedido.id}</p>
                        <p className="text-xs text-slate-500">{pedido.enderecoEntrega || "Entrega não informada"}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge value={pedido.status} type="pedido" />
                        <p className="mt-1 text-sm font-black text-[#E8442A]">{formatarMoeda(pedido.total)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </Card>
  );
}
