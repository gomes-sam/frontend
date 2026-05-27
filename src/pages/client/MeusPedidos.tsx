import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../services/error";
import { orderService } from "../../services/orderService";
import { clearSession } from "../../services/session";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import type { Pedido, StatusPedido } from "../../types";

const formatDataEHora = (iso?: string) => {
  if (!iso) return "—";

  const d = new Date(iso);

  const data = `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;

  const hora = `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;

  return `${data}, ${hora}`;
};

const traduzirStatus = (status: StatusPedido) => {
  switch (status) {
    case "AGUARDANDO":
      return "Aguardando";
    case "ACEITO":
      return "Aceito";
    case "EM_PREPARO":
      return "Em preparo";
    case "PRONTO":
      return "Pronto";
    case "A_CAMINHO":
      return "A caminho";
    case "ENTREGUE":
      return "Entregue";
    case "CANCELADO":
      return "Cancelado";
    case "RECUSADO":
      return "Recusado";
    default:
      return status;
  }
};

export default function MeusPedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    setLoading(true);
    setErro("");

    try {
      const lista = await orderService.listar();
      setPedidos(lista);
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível carregar seus pedidos."));
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] font-sans flex flex-col justify-between">
      <div>
        <header className="w-full bg-white border-b border-gray-100 px-12 py-4 flex items-center justify-between shadow-sm">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="bg-[#E8442A] text-white p-2 rounded-xl flex items-center justify-center font-bold text-lg w-9 h-9 shadow-sm">
              🍽️
            </div>

            <span className="text-lg font-black text-slate-900 tracking-tight">
              Boia <span className="text-[#E8442A]">Aqui</span>
            </span>
          </div>

          <nav className="flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="font-semibold text-sm text-slate-600 hover:text-[#E8442A] transition"
            >
              Restaurantes
            </button>

            <button
              onClick={() => navigate("/")}
              className="font-semibold text-sm text-slate-600 hover:text-[#E8442A] transition"
            >
              Buscar
            </button>

            <button className="font-semibold text-sm text-slate-900 transition border-b-2 border-slate-900 pb-0.5">
              Meus pedidos
            </button>
          </nav>

          <div>
            <button
              onClick={() => {
                clearSession();
                navigate("/");
              }}
              className="text-slate-700 hover:text-[#E8442A] font-bold text-xs transition"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full px-12 py-10">
          <BotaoVoltar className="mb-5" />
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Meus pedidos
            </h1>

            <button
              onClick={carregarPedidos}
              className="text-sm font-bold text-[#E8442A] hover:underline"
            >
              Atualizar
            </button>
          </div>

          {loading && (
            <p className="text-slate-500 text-center py-12 font-medium">
              Carregando seus pedidos...
            </p>
          )}

          {!loading && erro && (
            <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100 shadow-sm max-w-md mx-auto mt-8">
              <p className="text-red-600 font-semibold">{erro}</p>
            </div>
          )}

          {!loading && !erro && pedidos.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/60 shadow-sm max-w-md mx-auto mt-8">
              <p className="text-4xl mb-3">📦</p>
              <h3 className="text-slate-800 font-bold text-lg mb-1">
                Nenhum pedido
              </h3>
              <p className="text-slate-500 text-sm">
                Você ainda não realizou nenhum pedido no sistema.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-5 bg-[#E8442A] hover:bg-[#d13921] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition"
              >
                Ver restaurantes
              </button>
            </div>
          )}

          {!loading && !erro && pedidos.length > 0 && (
            <div className="flex flex-col gap-3">
              {pedidos.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/pedido/${p.id}`)}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <h3 className="text-slate-900 font-bold text-base group-hover:text-[#E8442A] transition">
                      {p.nomeRestaurante || "Restaurante"}
                    </h3>

                    <p className="text-slate-400 text-xs mt-1">
                      {formatDataEHora(p.criadoEm)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-900 font-bold text-base">
                      R$ {Number(p.total).toFixed(2).replace(".", ",")}
                    </span>

                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200/40">
                      {traduzirStatus(p.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="w-full text-center py-6 text-xs text-slate-400 tracking-wide">
        BoiaAqui © 2026 — feito com carinho.
      </footer>
    </div>
  );
}
