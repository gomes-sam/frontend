import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import RestauranteNaoVinculado from "../../components/common/RestauranteNaoVinculado";
import { Button } from "../../components/common/ui";
import { getApiErrorMessage, isRestaurantNotLinkedError } from "../../services/error";
import { orderService } from "../../services/orderService";
import type { Pedido, StatusPedido } from "../../types";
import { formatarData, formatarHora, formatarMoeda, traduzirFormaPagamento, traduzirStatusPedido } from "../../utils/formatters";

const statusOptions: StatusPedido[] = [
  "AGUARDANDO",
  "ACEITO",
  "EM_PREPARO",
  "PRONTO",
  "A_CAMINHO",
  "ENTREGUE",
  "RECUSADO",
  "CANCELADO",
];

export default function DetalhePedidoRestaurante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [semRestaurante, setSemRestaurante] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState<StatusPedido>("AGUARDANDO");
  const [motivoRecusa, setMotivoRecusa] = useState("");

  const carregar = useCallback(async () => {
    const pedidoId = Number(id);
    if (!id || Number.isNaN(pedidoId)) {
      setErro("Pedido inválido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro("");
    setSemRestaurante(false);
    try {
      const lista = await orderService.listarPedidosRestaurante();
      const encontrado = lista.find((item) => item.id === pedidoId) ?? null;
      setPedido(encontrado);
      if (encontrado) {
        setStatusSelecionado(encontrado.status);
        setMotivoRecusa(encontrado.motivoRecusa ?? "");
      }
    } catch (error) {
      setSemRestaurante(isRestaurantNotLinkedError(error));
      setErro(getApiErrorMessage(error, "Não foi possível carregar o pedido."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function atualizarStatus() {
    if (!pedido) return;
    const exigeMotivo = statusSelecionado === "RECUSADO" || statusSelecionado === "CANCELADO";

    if (exigeMotivo && !motivoRecusa.trim()) {
      setErro("Informe o motivo antes de recusar ou cancelar o pedido.");
      return;
    }

    setAtualizando(true);
    setErro("");
    try {
      await orderService.atualizarStatus(pedido.id, {
        status: statusSelecionado,
        motivoRecusa: exigeMotivo ? motivoRecusa.trim() : undefined,
      });
      await carregar();
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível atualizar o status."));
    } finally {
      setAtualizando(false);
    }
  }

  if (semRestaurante) return <RestauranteNaoVinculado retry={carregar} />;

  return (
    <section className="max-w-4xl mx-auto">
      <BotaoVoltar className="mb-5" />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Detalhe do pedido</h1>
          <p className="text-sm text-slate-500">Consulta feita pelos endpoints reais do restaurante.</p>
        </div>
        <button onClick={() => navigate("/restaurante/painel")} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
          Voltar ao painel
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center text-slate-500">Carregando pedido...</div>
      ) : erro ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center font-semibold text-red-700">{erro}</div>
      ) : !pedido ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center text-slate-500">Pedido não encontrado para este restaurante.</div>
      ) : (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Pedido #{pedido.id}</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{pedido.nomeRestaurante || "Pedido do cliente"}</h2>
              <p className="mt-1 text-sm text-slate-500">{formatarData(pedido.criadoEm)} às {formatarHora(pedido.criadoEm)}</p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-64">
              <select
                value={statusSelecionado}
                disabled={atualizando}
                onChange={(event) => setStatusSelecionado(event.target.value as StatusPedido)}
                className="rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-[#E8442A]"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{traduzirStatusPedido(status)}</option>
                ))}
              </select>
              {(statusSelecionado === "RECUSADO" || statusSelecionado === "CANCELADO") && (
                <textarea
                  value={motivoRecusa}
                  onChange={(event) => setMotivoRecusa(event.target.value)}
                  rows={3}
                  placeholder="Motivo da recusa ou cancelamento"
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E8442A]"
                />
              )}
              <Button disabled={atualizando || statusSelecionado === pedido.status} onClick={atualizarStatus}>
                {atualizando ? "Atualizando..." : "Atualizar status"}
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-y border-gray-100 py-5 text-sm">
            <p><span className="text-slate-500">Endereço:</span> <strong>{pedido.enderecoEntrega || "Não informado"}</strong></p>
            <p><span className="text-slate-500">Pagamento:</span> <strong>{traduzirFormaPagamento(pedido.formaPagamento)}</strong></p>
            {pedido.observacao && <p><span className="text-slate-500">Observação:</span> <strong>{pedido.observacao}</strong></p>}
            {pedido.motivoRecusa && <p className="text-red-600"><span>Motivo da recusa:</span> <strong>{pedido.motivoRecusa}</strong></p>}
          </div>

          <div className="mt-5 space-y-3">
            {pedido.itens?.map((item, index) => (
              <div key={`${item.menuItemId}-${index}`} className="flex justify-between gap-4 text-sm">
                <span>{item.quantidade}x {item.nomeItem}</span>
                <strong>{formatarMoeda(Number(item.precoUnitario) * item.quantidade)}</strong>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-gray-100 pt-5 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><strong>{formatarMoeda(pedido.subtotal)}</strong></p>
            <p className="flex justify-between"><span>Taxa de entrega</span><strong>{formatarMoeda(pedido.taxaEntrega)}</strong></p>
            <p className="flex justify-between text-lg"><span>Total</span><strong className="text-[#E8442A]">{formatarMoeda(pedido.total)}</strong></p>
          </div>
        </div>
      )}
    </section>
  );
}
