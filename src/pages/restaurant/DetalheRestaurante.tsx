import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../services/error";
import { orderService } from "../../services/orderService";
import { restaurantService } from "../../services/restaurantService";
import { clearSession } from "../../services/session";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import type { FormaPagamento, MenuItem, PedidoRequest, Restaurante } from "../../types";

interface ItemCarrinho {
  item: MenuItem;
  quantidade: number;
}

const fmt = (v: number | undefined) =>
  `R$ ${Number(v ?? 0).toFixed(2).replace(".", ",")}`;

export default function DetalheRestaurante() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [cardapio, setCardapio] = useState<MenuItem[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("PIX");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const logado = !!localStorage.getItem("@BoiaAqui:token");

  useEffect(() => {
    const restauranteId = Number(id);
    if (!id || Number.isNaN(restauranteId)) {
      setErro("Restaurante inválido.");
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all([
      restaurantService.buscarPorId(restauranteId),
      restaurantService.buscarCardapio(restauranteId),
    ])
      .then(([dadosRestaurante, itens]) => {
        setRestaurante(dadosRestaurante);
        setCardapio(itens);
      })
      .catch((error) => {
        setErro(getApiErrorMessage(error, "Não foi possível carregar o restaurante."));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const adicionarItem = (item: MenuItem) => {
    setCarrinho((prev) => {
      const existe = prev.find((c) => c.item.id === item.id);

      if (existe) {
        return prev.map((c) =>
          c.item.id === item.id
            ? { ...c, quantidade: c.quantidade + 1 }
            : c
        );
      }

      return [...prev, { item, quantidade: 1 }];
    });
  };

  const removerItem = (itemId: number) => {
    setCarrinho((prev) => {
      const existe = prev.find((c) => c.item.id === itemId);

      if (!existe) return prev;

      if (existe.quantidade === 1) {
        return prev.filter((c) => c.item.id !== itemId);
      }

      return prev.map((c) =>
        c.item.id === itemId
          ? { ...c, quantidade: c.quantidade - 1 }
          : c
      );
    });
  };

  const deletarItem = (itemId: number) => {
    setCarrinho((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const subtotal = carrinho.reduce(
    (acc, c) => acc + Number(c.item.preco) * c.quantidade,
    0
  );

  const taxaEntrega = Number(restaurante?.taxaEntrega ?? 0);
  const total = subtotal + taxaEntrega;
  const qtdTotal = carrinho.reduce((acc, c) => acc + c.quantidade, 0);

  const handleConfirmar = async () => {
    if (!logado) {
      navigate("/login");
      return;
    }

    if (carrinho.length === 0) {
      setErro("Adicione ao menos um item ao carrinho.");
      return;
    }

    if (!endereco.trim()) {
      setErro("Informe o endereço de entrega.");
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      const pedido: PedidoRequest = {
        restauranteId: Number(id),
        itens: carrinho.map((c) => ({
          menuItemId: c.item.id,
          quantidade: c.quantidade,
        })),
        formaPagamento,
        enderecoEntrega: endereco,
        observacao,
      };

      await orderService.criar(pedido);

      navigate("/meus-pedidos");
    } catch (error: unknown) {
      setErro(getApiErrorMessage(error, "Erro ao confirmar pedido."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF6EE] font-sans">

      {/* SIDEBAR */}
      <div className="w-48 min-w-[192px] bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm">
        <div>
          <div className="bg-[#E8442A] py-5 px-4 text-center shadow-sm">
            <span className="text-white font-extrabold text-xl tracking-tight">
              BoiaAqui
            </span>
          </div>

          <nav className="flex flex-col gap-1 p-3 mt-4">
            <button
              onClick={() => navigate("/")}
              className="text-left py-3 px-4 text-slate-500 hover:text-[#E8442A] hover:bg-orange-50 rounded-xl transition font-semibold text-sm"
            >
              Início
            </button>

            <button
              onClick={() => navigate("/meus-pedidos")}
              className="text-left py-3 px-4 text-slate-500 hover:text-[#E8442A] hover:bg-orange-50 rounded-xl transition font-semibold text-sm"
            >
              Meus Pedidos
            </button>
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              clearSession();
              navigate("/");
            }}
            className="w-full bg-gray-100 hover:bg-orange-50 text-slate-500 hover:text-[#E8442A] transition border border-gray-200 rounded-xl py-2.5 font-bold text-sm shadow-sm"
          >
            Sair
          </button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-500 font-medium">
              Carregando detalhes do restaurante...
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="bg-white px-8 py-5 border-b border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <BotaoVoltar className="mb-3" />
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {restaurante?.nomeFantasia}
                  </h1>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      restaurante?.aberto
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {restaurante?.aberto ? "Aberto" : "Fechado"}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-0.5">
                  {restaurante?.categoria} •{" "}
                  {restaurante?.tempoPedidoMin ?? 30} min • Entrega:{" "}
                  {taxaEntrega === 0 ? "Grátis" : fmt(taxaEntrega)}
                </p>
              </div>

              <button
                onClick={() => navigate("/")}
                className="text-sm font-bold text-[#E8442A] hover:underline"
              >
                ← Mudar de Restaurante
              </button>
            </div>

            {/* CARDÁPIO E CARRINHO */}
            <div className="flex-1 flex gap-8 overflow-hidden p-8">
              {/* CARDÁPIO */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Menu
                </h2>

                <div className="flex-1 overflow-y-auto space-y-3 pr-4">
                  {cardapio.length === 0 ? (
                    <p className="text-slate-500">Nenhum item disponível.</p>
                  ) : (
                    cardapio.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50 border border-gray-200 rounded-2xl p-4 hover:border-[#E8442A] transition cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900">
                              {item.nome}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                              {item.descricao}
                            </p>

                            <p className="text-sm font-bold text-[#E8442A] mt-2">
                              {fmt(item.preco)}
                            </p>
                          </div>

                          {!item.disponivel ? (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg whitespace-nowrap">
                              Indisponível
                            </span>
                          ) : (
                            <button
                              onClick={() => adicionarItem(item)}
                              className="bg-[#E8442A] text-white text-lg font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#d13921] transition"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CARRINHO */}
              <div className="w-80 flex flex-col border-l border-gray-200 pl-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Seu Pedido
                </h2>

                <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-3">
                  {carrinho.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                      Adicione itens ao carrinho.
                    </p>
                  ) : (
                    carrinho.map((c) => (
                      <div key={c.item.id} className="bg-slate-50 p-3 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {c.item.nome}
                          </h4>

                          <button
                            onClick={() => deletarItem(c.item.id)}
                            className="text-red-600 hover:text-red-700 text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removerItem(c.item.id)}
                              className="w-6 h-6 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                            >
                              −
                            </button>

                            <span className="font-bold text-slate-900 w-6 text-center">
                              {c.quantidade}
                            </span>

                            <button
                              onClick={() => adicionarItem(c.item)}
                              className="w-6 h-6 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-bold text-slate-900 text-sm">
                            {fmt(Number(c.item.preco) * c.quantidade)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* RESUMO */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-bold text-slate-900">
                      {fmt(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Taxa de entrega:</span>
                    <span className="font-bold text-slate-900">
                      {fmt(taxaEntrega)}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg border-t border-gray-200 pt-2 mt-2">
                    <span className="font-bold text-slate-900">Total:</span>
                    <span className="font-black text-[#E8442A]">
                      {fmt(total)}
                    </span>
                  </div>
                </div>

                {/* FORMULÁRIO */}
                <form
                  onSubmit={handleConfirmar}
                  className="mt-6 space-y-3 flex flex-col"
                >
                  {erro && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg">
                      ⚠️ {erro}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                      Endereço de Entrega
                    </label>

                    <input
                      type="text"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Rua, número, complemento"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#E8442A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                      Forma de Pagamento
                    </label>

                    <select
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#E8442A] focus:outline-none bg-white"
                    >
                      <option value="PIX">PIX</option>
                      <option value="DINHEIRO">Dinheiro</option>
                      <option value="CREDITO">Cartão de Crédito</option>
                      <option value="DEBITO">Cartão de Débito</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                      Observações (opcional)
                    </label>

                    <textarea
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      placeholder="Algo especial no seu pedido?"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-[#E8442A] focus:outline-none resize-none"
                      rows={2}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enviando || carrinho.length === 0}
                    className="w-full bg-[#E8442A] hover:bg-[#d13921] disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition mt-4"
                  >
                    {enviando ? "Processando..." : `Confirmar Pedido ${qtdTotal > 0 ? `(${qtdTotal})` : ""}`}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
