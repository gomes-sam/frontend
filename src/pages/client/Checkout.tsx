import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import { clearCheckoutDraft, getCheckoutDraft } from "../../services/cartService";
import { getApiErrorMessage } from "../../services/error";
import { orderService } from "../../services/orderService";
import { getSession } from "../../services/session";
import { formatarMoeda, traduzirFormaPagamento } from "../../utils/formatters";

export default function Checkout() {
  const navigate = useNavigate();
  const sessao = getSession()!;
  const [draft] = useState(() => getCheckoutDraft(sessao.id));
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!draft) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center max-w-xl mx-auto">
        <h1 className="text-xl font-black mb-3">Nenhum pedido para finalizar</h1>
        <button onClick={() => navigate("/")} className="bg-[#E8442A] text-white font-bold px-5 py-3 rounded-xl">Escolher restaurante</button>
      </div>
    );
  }

  const checkout = draft;
  const subtotal = checkout.itens.reduce((value, item) => value + item.item.preco * item.quantidade, 0);
  const taxa = Number(checkout.restaurante?.taxaEntrega || 0);

  async function finalizar() {
    setEnviando(true);
    setErro("");
    try {
      const pedido = await orderService.criar(checkout.pedido);
      clearCheckoutDraft();
      navigate("/pedido/sucesso", { replace: true, state: { pedidoId: pedido.id } });
    } catch (error) {
      setErro(getApiErrorMessage(error, "Nao foi possivel criar o pedido."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto">
      <BotaoVoltar className="mb-5" />
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-black mb-1">Checkout</h1>
        <p className="text-slate-500 mb-6">{checkout.restaurante?.nomeFantasia || "Restaurante"}</p>
        <div className="space-y-3 border-y border-gray-100 py-5">
          {checkout.itens.map(({ item, quantidade }) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{quantidade}x {item.nome}</span>
              <strong>{formatarMoeda(item.preco * quantidade)}</strong>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-sm py-5">
          <p>Entrega: <strong>{checkout.pedido.enderecoEntrega}</strong></p>
          <p>Pagamento: <strong>{traduzirFormaPagamento(checkout.pedido.formaPagamento)}</strong></p>
          {checkout.pedido.observacao && <p>Observacao: <strong>{checkout.pedido.observacao}</strong></p>}
          <p className="flex justify-between pt-3 text-lg"><span>Total</span><strong className="text-[#E8442A]">{formatarMoeda(subtotal + taxa)}</strong></p>
        </div>
        {erro && <p className="mb-4 rounded-xl bg-red-50 p-3 text-red-700 text-sm">{erro}</p>}
        <button disabled={enviando} onClick={finalizar} className="w-full bg-[#E8442A] disabled:bg-slate-300 text-white font-bold py-3 rounded-xl">
          {enviando ? "Enviando..." : "Confirmar pedido"}
        </button>
      </div>
    </section>
  );
}
