import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../services/error";
import { orderService } from "../../services/orderService";
import { clearSession } from "../../services/session";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import type { Pedido, StatusPedido } from "../../types";

const STATUS_STEPS: StatusPedido[] = [
  "AGUARDANDO",
  "ACEITO",
  "EM_PREPARO",
  "PRONTO",
  "A_CAMINHO",
  "ENTREGUE",
];

const STATUS_LABELS: Partial<Record<StatusPedido, string>> = {
  AGUARDANDO: "Pedido recebido",
  ACEITO: "Pedido aceito",
  EM_PREPARO: "Em preparo",
  PRONTO: "Pedido pronto",
  A_CAMINHO: "Saiu para entrega",
  ENTREGUE: "Pedido entregue",
};

function formatarDinheiro(valor: number) {
  return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
}

function formatarHora(data?: string) {
  if (!data) return "--:--";

  return new Date(data).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AcompanharPedido() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarPedido = useCallback(async () => {
    const pedidoId = Number(id);
    if (!id || Number.isNaN(pedidoId)) {
      setErro("Pedido inválido.");
      setLoading(false);
      return;
    }

    try {
      const dados = await orderService.buscar(pedidoId);
      setPedido(dados);
      setErro("");
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível carregar esse pedido."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarPedido();

    const interval = setInterval(carregarPedido, 30000);

    return () => clearInterval(interval);
  }, [carregarPedido]);

  const statusAtual = pedido?.status;
  const stepIndex = statusAtual ? STATUS_STEPS.indexOf(statusAtual) : -1;

  const subtotal =
    pedido?.itens?.reduce(
      (acc, item) => acc + Number(item.precoUnitario) * item.quantidade,
      0
    ) ?? 0;

  const taxaEntrega = Number(pedido?.taxaEntrega ?? 0);
  const total = Number(pedido?.total ?? subtotal + taxaEntrega);

  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] font-sans">
      <header className="w-full bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-[#E8442A] text-white p-2 rounded-xl flex items-center justify-center font-bold text-lg w-9 h-9 shadow-sm">
            🍽️
          </div>

          <span className="text-lg font-black text-slate-900 tracking-tight">
            Boia <span className="text-[#E8442A]">Aqui</span>
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="font-semibold text-sm text-slate-600 hover:text-[#E8442A] transition"
          >
            Restaurantes
          </button>

          <button
            onClick={() => navigate("/meus-pedidos")}
            className="font-semibold text-sm text-[#E8442A] transition"
          >
            Meus pedidos
          </button>

          <button
            onClick={() => {
              clearSession();
              navigate("/");
            }}
            className="font-bold text-xs text-slate-700 hover:text-[#E8442A] transition"
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <BotaoVoltar className="mb-4" />
        <button
          onClick={() => navigate("/meus-pedidos")}
          className="text-sm font-bold text-[#E8442A] hover:underline mb-6"
        >
          ← Voltar para meus pedidos
        </button>

        {loading ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-slate-500 font-medium">Carregando pedido...</p>
          </div>
        ) : erro ? (
          <div className="bg-red-50 rounded-3xl p-10 text-center border border-red-100 shadow-sm">
            <p className="text-red-600 font-semibold">{erro}</p>
          </div>
        ) : !pedido ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-slate-500 font-medium">Pedido não encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400 font-semibold">
                      Pedido #{pedido.id}
                    </p>

                    <h1 className="text-2xl font-black text-slate-900 mt-1">
                      Acompanhar pedido
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      Atualizado automaticamente a cada 30 segundos.
                    </p>
                  </div>

                  <span className="bg-orange-50 text-[#E8442A] text-xs font-bold px-4 py-2 rounded-full border border-orange-100">
                    {STATUS_LABELS[pedido.status] || pedido.status}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-5">
                  Status do pedido
                </h2>

                <div className="space-y-0">
                  {STATUS_STEPS.map((step, index) => {
                    const done = index <= stepIndex;
                    const isLast = index === STATUS_STEPS.length - 1;

                    return (
                      <div
                        key={step}
                        className="flex gap-4 relative min-h-[68px]"
                      >
                        {!isLast && (
                          <div
                            className={`absolute left-[14px] top-8 w-[2px] h-10 ${
                              done ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}

                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center z-10 font-bold text-xs ${
                            done
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {done ? "✓" : ""}
                        </div>

                        <div>
                          <p
                            className={`text-sm font-bold ${
                              done ? "text-slate-900" : "text-slate-400"
                            }`}
                          >
                            {STATUS_LABELS[step]}
                          </p>

                          {index === 0 && (
                            <p className="text-xs text-slate-400 mt-1">
                              Criado às{" "}
                              {formatarHora(pedido.criadoEm)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-4">
                  Entrega
                </h2>

                <p className="text-sm text-slate-500">
                  Endereço:
                  <strong className="text-slate-900 ml-1">
                    {pedido.enderecoEntrega || "Não informado"}
                  </strong>
                </p>

                {pedido.observacao && (
                  <p className="text-sm text-slate-500 mt-2">
                    Observação:
                    <strong className="text-slate-900 ml-1">
                      {pedido.observacao}
                    </strong>
                  </p>
                )}

                <p className="text-sm text-slate-500 mt-2">
                  Pagamento:
                  <strong className="text-slate-900 ml-1">
                    {pedido.formaPagamento}
                  </strong>
                </p>

                {pedido.motivoRecusa && (
                  <p className="text-sm text-red-600 mt-2">
                    Motivo da recusa:
                    <strong className="ml-1">{pedido.motivoRecusa}</strong>
                  </p>
                )}
              </div>
            </section>

            <aside className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit">
              <h2 className="text-lg font-black text-slate-900 mb-4">
                Resumo do pedido
              </h2>

              <div className="space-y-3">
                {pedido.itens?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-3 border-b border-gray-100 pb-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {item.quantidade}x {item.nomeItem}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-slate-700">
                      {formatarDinheiro(
                        Number(item.precoUnitario) * item.quantidade
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatarDinheiro(subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Taxa de entrega</span>
                  <span>
                    {taxaEntrega === 0 ? "Grátis" : formatarDinheiro(taxaEntrega)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-900 font-black text-base pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#E8442A]">
                    {formatarDinheiro(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={carregarPedido}
                className="w-full bg-[#E8442A] hover:bg-[#d13921] text-white font-bold py-3 rounded-xl text-sm transition mt-6"
              >
                Atualizar status
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
