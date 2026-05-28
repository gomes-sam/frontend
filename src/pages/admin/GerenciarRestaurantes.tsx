import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { resolveAssetUrl } from "../../services/api";
import { getApiErrorMessage } from "../../services/error";
import { clearSession } from "../../services/session";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import type { Restaurante } from "../../types";

export default function GerenciarRestaurantes() {
  const navigate = useNavigate();

  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [erro, setErro] = useState("");

  const listaCategorias = [
    "PIZZARIA",
    "HAMBURGUERIA",
    "JAPONESA",
    "BRASILEIRA",
    "ITALIANA",
    "MEXICANA",
    "SAUDAVEL",
    "DOCERIA",
    "OUTROS",
  ];

  async function carregarRestaurantes() {
    setLoading(true);
    setErro("");

    try {
      const pagina = await adminService.listarRestaurantes(0, 1000);
      setRestaurantes(pagina.content ?? []);
    } catch (error) {
      setErro(getApiErrorMessage(error, "Erro ao carregar restaurantes."));
      setRestaurantes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarRestaurantes();
  }, []);

  async function ativarDesativar(id: number) {
    try {
      await adminService.ativarDesativarRestaurante(id);
      await carregarRestaurantes();
    } catch (error) {
      setErro(getApiErrorMessage(error, "Erro ao alterar status do restaurante."));
    }
  }

  async function deletar(id: number) {
    if (!window.confirm("Deseja realmente remover este restaurante?")) return;

    try {
      await adminService.deletarRestaurante(id);
      await carregarRestaurantes();
    } catch (error) {
      setErro(getApiErrorMessage(error, "Erro ao deletar restaurante."));
    }
  }

  const filtrados = restaurantes.filter((r) => {
    const bateTexto = r.nomeFantasia
      .toLowerCase()
      .includes(busca.toLowerCase());

    const bateCategoria =
      filtroCategoria === "Todos" || r.categoria === filtroCategoria;

    return bateTexto && bateCategoria;
  });

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
            <button
              onClick={() => navigate("/admin/home")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition"
            >
              🏠 Início
            </button>

            <button className="w-full text-left px-4 py-3 text-sm font-semibold bg-[#E8442A]/10 text-[#E8442A] rounded-xl transition">
              🏪 Restaurantes
            </button>

            <button
              onClick={() => navigate("/admin/clientes")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition"
            >
              👤 Clientes
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
              Gerenciar Restaurantes
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Ative, desative ou remova estabelecimentos parceiros.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Buscar restaurante por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-white pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8442A] outline-none text-slate-800 placeholder-slate-400 shadow-sm text-sm transition"
            />
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="bg-white px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8442A] outline-none text-slate-700 text-sm shadow-sm transition min-w-[180px]"
          >
            <option value="Todos">Todas as Categorias</option>

            {listaCategorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold mb-4">
            {erro}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-20">Banner</th>
                  <th className="py-4 px-6">Nome</th>
                  <th className="py-4 px-6">Categoria</th>
                  <th className="py-4 px-6">Tempo</th>
                  <th className="py-4 px-6">Taxa</th>
                  <th className="py-4 px-6">Aberto</th>
                  <th className="py-4 px-6">Ativo</th>
                  <th className="py-4 px-6 text-center">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-slate-700 text-sm font-medium">
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-10 text-slate-400 text-xs"
                    >
                      Carregando restaurantes...
                    </td>
                  </tr>
                ) : filtrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-slate-400 text-xs"
                    >
                      Nenhum restaurante encontrado.
                    </td>
                  </tr>
                ) : (
                  filtrados.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 text-center">
                        <div className="w-10 h-10 rounded-xl bg-[#E8442A]/10 flex items-center justify-center mx-auto overflow-hidden">
                          {r.fotoCapa ? (
                            <img
                              src={resolveAssetUrl(r.fotoCapa)}
                              alt={r.nomeFantasia}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>🏪</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-900 font-semibold">
                        {r.nomeFantasia}
                      </td>

                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full">
                          {r.categoria}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {r.tempoPedidoMin ?? 40} min
                      </td>

                      <td className="py-4 px-6 text-xs">
                        {!r.taxaEntrega || r.taxaEntrega === 0 ? (
                          <span className="text-emerald-600 font-bold">
                            Grátis
                          </span>
                        ) : (
                          `R$ ${Number(r.taxaEntrega)
                            .toFixed(2)
                            .replace(".", ",")}`
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            r.aberto
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {r.aberto ? "Aberto" : "Fechado"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            r.ativo
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {r.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => ativarDesativar(r.id)}
                            className={`text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm ${
                              r.ativo
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {r.ativo ? "Desativar" : "Ativar"}
                          </button>

                          <button
                            onClick={() => deletar(r.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          💡 Restaurantes são cadastrados pelos próprios donos no momento do registro.
        </p>
      </main>
    </div>
  );
}
