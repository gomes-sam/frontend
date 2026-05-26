import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { api, clearSession } from "../../services/api";
import BotaoVoltar from "../../components/common/BotaoVoltar";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  ativo: boolean;
  tipo: string;
}

const emptyForm = {
  nome: "",
  email: "",
  senha: "",
  cpf: "",
  telefone: "",
  tipo: "CLIENTE",
};

type ClienteForm = typeof emptyForm;

export default function GerenciarClientes() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [form, setForm] = useState(emptyForm);

  async function carregarClientes() {
    setLoading(true);
    setErro("");

    try {
      const response = await adminService.listarClientes(0, 1000);
      setClientes(response.data.content ?? []);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function abrirModal() {
    setForm(emptyForm);
    setErro("");
    setModalAberto(true);
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();

    setErro("");

    try {
      await api.post("/auth/register", {
        ...form,
        cpf: form.cpf.replace(/\D/g, ""),
        telefone: form.telefone.replace(/\D/g, ""),
      });

      setModalAberto(false);
      setForm(emptyForm);

      await carregarClientes();
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: unknown; erro?: unknown } } };

      const msg =
        err.response?.data?.message ||
        err.response?.data?.erro ||
        "Erro ao cadastrar cliente.";

      setErro(Array.isArray(msg) ? msg.join(", ") : String(msg));
    }
  }

  async function ativarDesativar(id: number) {
    try {
      await adminService.ativarDesativarUsuario(id);
      await carregarClientes();
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar status.");
    }
  }

  async function deletar(id: number) {
    const confirmar = window.confirm(
      "Deseja realmente deletar este cliente?"
    );

    if (!confirmar) return;

    try {
      await adminService.deletarUsuario(id);
      await carregarClientes();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar cliente.");
    }
  }

  const filtrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FAF6EE] font-sans">
      {/* SIDEBAR */}
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
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              🏠 Início
            </button>

            <button
              onClick={() => navigate("/admin/restaurantes")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              🏪 Restaurantes
            </button>

            <button className="w-full text-left px-4 py-3 text-sm font-semibold bg-[#E8442A]/10 text-[#E8442A] rounded-xl transition">
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

      {/* CONTEÚDO */}
      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <BotaoVoltar className="mb-5" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Gerenciar Clientes
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Visualize, ative/desative e gerencie os clientes da plataforma.
            </p>
          </div>

          <button
            onClick={abrirModal}
            className="bg-[#E8442A] hover:bg-[#d23920] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"
          >
            + Novo Cliente
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full max-w-md bg-white px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8442A] outline-none text-slate-800 placeholder-slate-400 shadow-sm text-sm transition"
          />
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="py-4 px-6">Nome</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">CPF</th>
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
                    Carregando clientes...
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-slate-400 text-xs"
                  >
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filtrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-slate-50/50 transition"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {cliente.nome}
                    </td>

                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {cliente.email}
                    </td>

                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {cliente.cpf || "—"}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          cliente.ativo
                            ? "bg-green-50 text-green-700 border-green-200/50"
                            : "bg-red-50 text-red-700 border-red-200/50"
                        }`}
                      >
                        {cliente.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            ativarDesativar(cliente.id)
                          }
                          className={`text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm ${
                            cliente.ativo
                              ? "bg-amber-500 hover:bg-amber-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {cliente.ativo ? "Desativar" : "Ativar"}
                        </button>

                        <button
                          onClick={() => deletar(cliente.id)}
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
      </main>

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h2 className="text-lg font-black text-slate-900 mb-5">
              Novo Cliente
            </h2>

            <form onSubmit={handleCadastrar} className="space-y-4">
              {(
                [
                  ["nome", "Nome"],
                  ["email", "Email"],
                  ["senha", "Senha"],
                  ["cpf", "CPF"],
                  ["telefone", "Telefone"],
                ] as Array<[keyof ClienteForm, string]>
              ).map(([campo, label]) => (
                <div key={campo}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {label}
                  </label>

                  <input
                    type={
                      campo === "senha"
                        ? "password"
                        : campo === "email"
                        ? "email"
                        : "text"
                    }
                    value={form[campo]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [campo]: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E8442A] text-slate-800 transition"
                  />
                </div>
              ))}

              {erro && (
                <p className="text-red-500 text-xs text-center font-semibold">
                  {erro}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold px-4 py-2 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-[#E8442A] hover:bg-[#d23920] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
