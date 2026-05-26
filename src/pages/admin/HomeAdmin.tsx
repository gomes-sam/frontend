import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import type { Usuario, Restaurante } from "../../types";
import { clearSession } from "../../services/api";
import BotaoVoltar from "../../components/common/BotaoVoltar";

export default function HomeAdmin() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalRestaurantes, setTotalRestaurantes] = useState(0);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  const [loading, setLoading] = useState(true);

  async function carregarDados() {
    setLoading(true);

    try {
      const [usuariosRes, restaurantesRes] = await Promise.all([
        adminService.listarUsuarios(0, 1000),
        adminService.listarRestaurantes(0, 1000),
      ]);

      const listaUsuarios = usuariosRes.data.content ?? [];
      const listaRestaurantes = restaurantesRes.data.content ?? [];

      setUsuarios(listaUsuarios.slice(0, 5));
      setRestaurantes(listaRestaurantes.slice(0, 5));

      setTotalClientes(
        listaUsuarios.filter((u) => u.tipo === "CLIENTE").length
      );

      setTotalFuncionarios(
        listaUsuarios.filter((u) => u.tipo === "FUNCIONARIO").length
      );

      setTotalRestaurantes(listaRestaurantes.length);
    } catch (err) {
      console.error("Erro ao carregar painel:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function ativarDesativarUsuario(id: number) {
    try {
      await adminService.ativarDesativarUsuario(id);
      carregarDados();
    } catch (err) {
      console.error(err);
    }
  }

  async function ativarDesativarRestaurante(id: number) {
    try {
      await adminService.ativarDesativarRestaurante(id);
      carregarDados();
    } catch (err) {
      console.error(err);
    }
  }

  async function deletarUsuario(id: number) {
    if (!window.confirm("Deseja realmente deletar este usuário?")) return;

    try {
      await adminService.deletarUsuario(id);
      carregarDados();
    } catch (err) {
      console.error(err);
    }
  }

  async function deletarRestaurante(id: number) {
    if (!window.confirm("Deseja realmente deletar este restaurante?")) return;

    try {
      await adminService.deletarRestaurante(id);
      carregarDados();
    } catch (err) {
      console.error(err);
    }
  }

  const tipoLabel: Record<string, string> = {
    CLIENTE: "Cliente",
    RESTAURANTE: "Restaurante",
    FUNCIONARIO: "Funcionário",
    ADMIN: "Admin",
  };

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
              🏠 Início
            </button>

            <button
              onClick={() => navigate("/admin/restaurantes")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              🏪 Restaurantes
            </button>

            <button
              onClick={() => navigate("/admin/clientes")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
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
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Painel Administrativo
          </h1>

          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Visão geral do ecossistema BoiaAqui
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Clientes",
              valor: totalClientes,
              rota: "/admin/clientes",
              sub: "Gerenciar →",
            },
            {
              label: "Restaurantes",
              valor: totalRestaurantes,
              rota: "/admin/restaurantes",
              sub: "Ver lojas →",
            },
            {
              label: "Funcionários",
              valor: totalFuncionarios,
              rota: "/admin/clientes",
              sub: "Visualizar →",
            },
          ].map((card) => (
            <button
              key={card.label}
              onClick={() => navigate(card.rota)}
              className="bg-white p-5 rounded-2xl border border-gray-100 text-left shadow-sm hover:shadow-md hover:border-gray-200 transition group flex flex-col justify-between min-h-[110px]"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {card.label}
                </h3>

                <p className="text-3xl font-black text-[#E8442A] mt-1">
                  {card.valor}
                </p>
              </div>

              <span className="text-xs font-bold text-[#E8442A] group-hover:translate-x-1 transition-transform">
                {card.sub}
              </span>
            </button>
          ))}
        </div>

        {/* USUÁRIOS */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Usuários Recentes
            </h2>

            <button
              onClick={() => navigate("/admin/clientes")}
              className="text-xs font-bold text-[#E8442A] hover:underline"
            >
              Ver todos →
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">Nome</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Tipo</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center w-44">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-sm font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-slate-400 text-xs"
                    >
                      Carregando usuários...
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-slate-400 text-xs"
                    >
                      Nenhum usuário cadastrado.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {u.nome}
                      </td>

                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {u.email}
                      </td>

                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200/50">
                          {tipoLabel[u.tipo] ?? u.tipo}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            u.ativo
                              ? "bg-green-50 text-green-700 border-green-200/50"
                              : "bg-red-50 text-red-700 border-red-200/50"
                          }`}
                        >
                          {u.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              ativarDesativarUsuario(u.id)
                            }
                            className={`text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm ${
                              u.ativo
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {u.ativo ? "Desativar" : "Ativar"}
                          </button>

                          <button
                            onClick={() => deletarUsuario(u.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm"
                          >
                            Deletar
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

        {/* RESTAURANTES */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Restaurantes Parceiros
            </h2>

            <button
              onClick={() => navigate("/admin/restaurantes")}
              className="text-xs font-bold text-[#E8442A] hover:underline"
            >
              Ver todos →
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">Nome Comercial</th>
                  <th className="py-4 px-6">Status Conta</th>
                  <th className="py-4 px-6">Expediente</th>
                  <th className="py-4 px-6 text-center w-44">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-sm font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-slate-400 text-xs"
                    >
                      Carregando estabelecimentos...
                    </td>
                  </tr>
                ) : restaurantes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-slate-400 text-xs"
                    >
                      Nenhum restaurante credenciado.
                    </td>
                  </tr>
                ) : (
                  restaurantes.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {r.nomeFantasia}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            r.ativo
                              ? "bg-green-50 text-green-700 border-green-200/50"
                              : "bg-red-50 text-red-700 border-red-200/50"
                          }`}
                        >
                          {r.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            r.aberto
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : "bg-slate-100 text-slate-500 border-slate-200/50"
                          }`}
                        >
                          {r.aberto ? "Aberto" : "Fechado"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              ativarDesativarRestaurante(r.id)
                            }
                            className={`text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm ${
                              r.ativo
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {r.ativo ? "Desativar" : "Ativar"}
                          </button>

                          <button
                            onClick={() => deletarRestaurante(r.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm"
                          >
                            Deletar
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
      </main>
    </div>
  );
}
