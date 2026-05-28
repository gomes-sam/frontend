import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage, isRestaurantNotLinkedError } from "../../services/error";
import { orderService } from "../../services/orderService";
import { clearSession } from "../../services/session";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import RestauranteNaoVinculado from "../../components/common/RestauranteNaoVinculado";
import type { Pedido, StatusPedido } from "../../types";

const statusOptions: StatusPedido[] = [
  "AGUARDANDO",
  "ACEITO",
  "EM_PREPARO",
  "PRONTO",
  "A_CAMINHO",
  "ENTREGUE",
  "CANCELADO",
  "RECUSADO",
];

function traduzirStatus(status: StatusPedido) {
  const labels: Record<StatusPedido, string> = {
    AGUARDANDO: "Pendente",
    ACEITO: "Aceito",
    EM_PREPARO: "Em preparo",
    PRONTO: "Pronto",
    A_CAMINHO: "A caminho",
    ENTREGUE: "Entregue",
    CANCELADO: "Cancelado",
    RECUSADO: "Recusado",
  };

  return labels[status] || status;
}

function formatarData(data?: string) {
  if (!data) return "—";
  return new Date(data).toLocaleString("pt-BR");
}

export default function PainelRestaurante() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagemOperacao, setMensagemOperacao] = useState("");
  const [semRestaurante, setSemRestaurante] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const [alternandoAberto, setAlternandoAberto] = useState(false);

  async function carregarPedidos() {
    setLoading(true);
    setErro("");
    setMensagemOperacao("");
    setSemRestaurante(false);

    try {
      const lista = await orderService.listarPedidosRestaurante();
      setPedidos(lista);
    } catch (error) {
      setSemRestaurante(isRestaurantNotLinkedError(error));
      setErro(getApiErrorMessage(error, "Erro ao carregar pedidos do restaurante."));
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(id: number, status: StatusPedido) {
    if (status === "RECUSADO" || status === "CANCELADO") {
      setMensagemOperacao("Abra os detalhes do pedido para informar o motivo antes de recusar ou cancelar.");
      return;
    }

    setAtualizandoId(id);
    try {
      await orderService.atualizarStatus(id, {
        status,
      });

      await carregarPedidos();
    } catch (error) {
      tratarErroDeOperacao(error, "Erro ao atualizar status do pedido.");
    } finally {
      setAtualizandoId(null);
    }
  }

  async function alternarAberto() {
    setAlternandoAberto(true);
    try {
      await orderService.alternarAberto();
      setMensagemOperacao("Status de funcionamento alterado.");
    } catch (error) {
      tratarErroDeOperacao(error, "Erro ao alterar status do restaurante.");
    } finally {
      setAlternandoAberto(false);
    }
  }

  function tratarErroDeOperacao(error: unknown, fallback: string) {
    if (isRestaurantNotLinkedError(error)) {
      setSemRestaurante(true);
      setPedidos([]);
      return;
    }
    setMensagemOperacao(getApiErrorMessage(error, fallback));
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FAF6EE] font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-8 select-none">
            <div className="w-9 h-9 rounded-lg bg-[#E8442A] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              🍽️
            </div>

            <span className="font-black text-lg text-slate-900 tracking-tight">
              Boia <span className="text-[#E8442A]">Aqui</span>
            </span>
          </div>

          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 text-sm font-semibold bg-[#E8442A]/10 text-[#E8442A] rounded-xl transition">
              📋 Pedidos Recebidos
            </button>

            <button
              onClick={() => navigate("/restaurante/cardapio")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              🍔 Cardápio
            </button>

            <button
              onClick={() => navigate("/restaurante/meu-restaurante")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              Meu Restaurante
            </button>

            <button
              onClick={() => navigate("/restaurante/funcionarios")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              👥 Funcionários
            </button>
          </nav>
        </div>

        <button
          onClick={() => {
            clearSession();
            navigate("/");
          }}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl text-sm font-bold transition shadow-sm"
        >
          Sair
        </button>
      </aside>

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <BotaoVoltar className="mb-5" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Pedidos Recebidos
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Acompanhe e atualize os pedidos feitos pelos clientes.
            </p>
          </div>

          {!semRestaurante && <div className="flex gap-3">
            <button
              onClick={carregarPedidos}
              className="bg-white border border-gray-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm hover:bg-slate-50"
            >
              Atualizar
            </button>

            <button
              onClick={alternarAberto}
              disabled={alternandoAberto}
              className="bg-[#E8442A] hover:bg-[#d23920] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"
            >
              {alternandoAberto ? "Alterando..." : "Abrir/Fechar loja"}
            </button>
          </div>}
        </div>

        {mensagemOperacao && !semRestaurante && !loading && !erro && (
          <div className="mb-5 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            {mensagemOperacao}
          </div>
        )}

        {semRestaurante ? (
          <RestauranteNaoVinculado retry={carregarPedidos} />
        ) : loading ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">
              Carregando pedidos...
            </p>
          </div>
        ) : erro ? (
          <div className="bg-red-50 rounded-3xl p-10 text-center border border-red-100 shadow-sm">
            <p className="text-red-600 font-semibold">{erro}</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-slate-600 font-bold">
              Nenhum pedido recebido ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400 font-bold">
                      Pedido #{pedido.id}
                    </p>

                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {pedido.nomeRestaurante || "Pedido do cliente"}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {formatarData(pedido.criadoEm)}
                    </p>

                    <p className="text-sm text-slate-500 mt-3">
                      Endereço:{" "}
                      <strong className="text-slate-900">
                        {pedido.enderecoEntrega || "Não informado"}
                      </strong>
                    </p>

                    {pedido.observacao && (
                      <p className="text-sm text-slate-500 mt-1">
                        Observação:{" "}
                        <strong className="text-slate-900">
                          {pedido.observacao}
                        </strong>
                      </p>
                    )}

                    <p className="text-sm text-slate-500 mt-1">
                      Pagamento:{" "}
                      <strong className="text-slate-900">
                        {pedido.formaPagamento}
                      </strong>
                    </p>

                    {pedido.motivoRecusa && (
                      <p className="text-sm text-red-600 mt-1">
                        Motivo da recusa:{" "}
                        <strong>{pedido.motivoRecusa}</strong>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 min-w-[220px]">
                    <span className="bg-orange-50 text-[#E8442A] text-xs font-bold px-4 py-2 rounded-full border border-orange-100 text-center">
                      {traduzirStatus(pedido.status)}
                    </span>

                    <button
                      onClick={() => navigate(`/restaurante/pedidos/${pedido.id}`)}
                      className="bg-white border border-gray-200 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold transition hover:bg-slate-50"
                    >
                      Ver detalhes
                    </button>

                    <select
                      value={pedido.status}
                      disabled={atualizandoId === pedido.id}
                      onChange={(e) =>
                        atualizarStatus(pedido.id, e.target.value as StatusPedido)
                      }
                      className="bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#E8442A]"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {traduzirStatus(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-5 pt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                    Itens do pedido
                  </p>

                  <div className="space-y-2">
                    {pedido.itens?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-700 font-medium">
                          {item.quantidade}x {item.nomeItem}
                        </span>

                        <span className="text-slate-900 font-bold">
                          R${" "}
                          {(
                            Number(item.precoUnitario) * item.quantidade
                          )
                            .toFixed(2)
                            .replace(".", ",")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                    <span className="text-lg font-black text-[#E8442A]">
                      Total: R${" "}
                      {Number(pedido.total).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
