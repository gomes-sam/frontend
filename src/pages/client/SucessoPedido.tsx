import { useLocation, useNavigate } from "react-router-dom";

export default function SucessoPedido() {
  const navigate = useNavigate();
  const location = useLocation();
  const pedidoId = (location.state as { pedidoId?: number } | null)?.pedidoId;

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-black text-slate-900 mb-3">Pedido realizado com sucesso</h1>
      <p className="text-slate-500 mb-7">Seu pedido foi enviado ao restaurante.</p>
      <div className="flex justify-center gap-3">
        {pedidoId && <button onClick={() => navigate(`/pedido/${pedidoId}`)} className="bg-[#E8442A] text-white font-bold px-5 py-3 rounded-xl">Acompanhar pedido</button>}
        <button onClick={() => navigate("/meus-pedidos")} className="border border-gray-200 font-bold px-5 py-3 rounded-xl">Meus pedidos</button>
      </div>
    </section>
  );
}
