import { useEffect, useState } from "react";
import RestauranteNaoVinculado from "../../components/common/RestauranteNaoVinculado";
import { getApiErrorMessage, isRestaurantNotLinkedError } from "../../services/error";
import { orderService } from "../../services/orderService";
import type { Pedido } from "../../types";
import { formatarMoeda } from "../../utils/formatters";

export default function DashboardRestaurante() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [erro, setErro] = useState("");
  const [semRestaurante, setSemRestaurante] = useState(false);

  async function carregar() {
    setErro("");
    setSemRestaurante(false);
    try {
      setPedidos(await orderService.listarPedidosRestaurante());
    } catch (error) {
      setSemRestaurante(isRestaurantNotLinkedError(error));
      setErro(getApiErrorMessage(error, "Nao foi possivel carregar o dashboard."));
    }
  }

  useEffect(() => {
    let active = true;
    orderService.listarPedidosRestaurante().then((lista) => {
      if (active) setPedidos(lista);
    }).catch((error) => {
      if (!active) return;
      setSemRestaurante(isRestaurantNotLinkedError(error));
      setErro(getApiErrorMessage(error, "Nao foi possivel carregar o dashboard."));
    });
    return () => { active = false; };
  }, []);
  if (semRestaurante) return <RestauranteNaoVinculado retry={carregar} />;

  const recebidos = pedidos.length;
  const emAndamento = pedidos.filter((p) => !["ENTREGUE", "RECUSADO", "CANCELADO"].includes(p.status)).length;
  const total = pedidos.filter((p) => p.status === "ENTREGUE").reduce((value, p) => value + Number(p.total), 0);
  return (
    <section>
      <h1 className="text-2xl font-black mb-1">Dashboard Restaurante</h1>
      <p className="text-slate-500 mb-8">Resumo dos pedidos carregados do back-end.</p>
      {erro && <p className="bg-red-50 text-red-700 p-4 rounded-xl mb-5">{erro}</p>}
      <div className="grid md:grid-cols-3 gap-4">
        <Card label="Pedidos recebidos" value={String(recebidos)} />
        <Card label="Em andamento" value={String(emAndamento)} />
        <Card label="Entregues (valor)" value={formatarMoeda(total)} />
      </div>
    </section>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="bg-white rounded-2xl border border-gray-100 p-6"><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-black mt-2 text-slate-900">{value}</p></div>;
}
