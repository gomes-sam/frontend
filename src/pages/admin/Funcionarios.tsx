import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveAssetUrl } from "../../services/api";
import { getApiErrorMessage } from "../../services/error";
import { clearSession } from "../../services/session";
import { employeeService } from "../../services/employeeService";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import type { Funcionario, FuncionarioRequest } from "../../types";

export default function Funcionarios() {
  const navigate = useNavigate();

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("Todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cargo, setCargo] = useState("Garçom");
  const [setor, setSetor] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");

  const listaCargos = ["Garçom", "Garçonete", "Cozinheiro", "Gerente", "Caixa"];

  async function carregarFuncionarios() {
    setLoading(true);
    setErro("");

    try {
      const lista = await employeeService.listar();
      setFuncionarios(lista);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      setFuncionarios([]);
      setErro("Erro ao carregar funcionários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!nome || !cpf || !cargo || !setor || !email || !senha) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const dados: FuncionarioRequest = {
      nome,
      cpf: cpf.replace(/\D/g, ""),
      cargo,
      setor,
      email,
      senha,
      telefone: telefone.replace(/\D/g, "") || undefined,
    };

    try {
      if (editandoId) {
        await employeeService.editar(editandoId, dados, foto);
      } else {
        await employeeService.cadastrar(dados, foto);
      }

      await carregarFuncionarios();
      fecharModal();
    } catch (error: unknown) {
      setErro(getApiErrorMessage(error, "Erro ao salvar funcionário. Verifique os dados."));
    }
  }

  async function handleExcluir(id: number) {
    const confirmar = window.confirm(
      "Deseja realmente remover este funcionário?"
    );

    if (!confirmar) return;

    try {
      await employeeService.deletar(id);
      await carregarFuncionarios();
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      alert("Erro ao deletar funcionário.");
    }
  }

  function abrirCadastro() {
    setEditandoId(null);
    setNome("");
    setCpf("");
    setCargo("Garçom");
    setSetor("");
    setEmail("");
    setSenha("");
    setTelefone("");
    setFoto(null);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(f: Funcionario) {
    setEditandoId(f.id);
    setNome(f.nome);
    setCpf(f.cpf);
    setCargo(f.cargo);
    setSetor(f.setor);
    setEmail(f.email);
    setSenha("");
    setTelefone(f.telefone || "");
    setFoto(null);
    setErro("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
    setErro("");
  }

  const funcionariosFiltrados = funcionarios.filter((f) => {
    const texto = busca.toLowerCase();

    const bateTexto =
      f.nome.toLowerCase().includes(texto) ||
      f.cargo.toLowerCase().includes(texto) ||
      f.email.toLowerCase().includes(texto);

    const bateCargo = filtroCargo === "Todos" || f.cargo === filtroCargo;

    return bateTexto && bateCargo;
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
              onClick={() => navigate("/restaurante/painel")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              📋 Pedidos Recebidos
            </button>

            <button
              onClick={() => navigate("/restaurante/cardapio")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              🍔 Cardápio
            </button>

            <button className="w-full text-left px-4 py-3 text-sm font-semibold bg-[#E8442A]/10 text-[#E8442A] rounded-xl transition">
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
              Gerenciar Funcionários
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cadastre, edite e remova funcionários do restaurante.
            </p>
          </div>

          <button
            onClick={abrirCadastro}
            className="bg-[#E8442A] hover:bg-[#d23920] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm flex items-center gap-2"
          >
            + Adicionar Funcionário
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Buscar por nome, cargo ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-white pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8442A] outline-none text-slate-800 placeholder-slate-400 shadow-sm text-sm transition"
            />
          </div>

          <select
            value={filtroCargo}
            onChange={(e) => setFiltroCargo(e.target.value)}
            className="bg-white px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8442A] outline-none text-slate-700 text-sm shadow-sm transition min-w-[160px]"
          >
            <option value="Todos">Todos os Cargos</option>
            {listaCargos.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {erro && !modalAberto && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold mb-4">
            {erro}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-20">Foto</th>
                  <th className="py-4 px-6">Nome</th>
                  <th className="py-4 px-6">CPF</th>
                  <th className="py-4 px-6">Cargo</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6 text-center w-40">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-slate-700 text-sm font-medium">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-slate-400 text-xs"
                    >
                      Carregando funcionários...
                    </td>
                  </tr>
                ) : funcionariosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-slate-400 text-xs"
                    >
                      Nenhum funcionário encontrado.
                    </td>
                  </tr>
                ) : (
                  funcionariosFiltrados.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 text-center">
                        {f.fotoPerfil ? (
                          <img
                            src={resolveAssetUrl(f.fotoPerfil)}
                            alt={f.nome}
                            className="w-9 h-9 rounded-full object-cover mx-auto"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#E8442A]/10 text-[#E8442A] font-bold text-sm flex items-center justify-center mx-auto">
                            {f.nome.charAt(0)}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-slate-900 font-semibold">
                        {f.nome}
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                        {f.cpf}
                      </td>

                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200/50">
                          {f.cargo}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500">{f.email}</td>

                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => abrirEdicao(f)}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => handleExcluir(f.id)}
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
      </main>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">
              {editandoId ? "Editar Funcionário" : "Adicionar Novo Funcionário"}
            </h3>

            <form onSubmit={handleSalvar} className="space-y-4">
              <Input
                label="Nome *"
                value={nome}
                onChange={setNome}
                placeholder="Nome completo"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CPF *"
                  value={cpf}
                  onChange={setCpf}
                  placeholder="000.000.000-00"
                />

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Cargo *
                  </label>

                  <select
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E8442A] text-slate-700 transition"
                  >
                    {listaCargos.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Setor *"
                value={setor}
                onChange={setSetor}
                placeholder="Ex: Cozinha, Salão..."
              />

              <Input
                label="Email *"
                value={email}
                onChange={setEmail}
                placeholder="email@exemplo.com"
                type="email"
              />

              <Input
                label="Senha *"
                value={senha}
                onChange={setSenha}
                placeholder="••••••••"
                type="password"
                required
              />

              <Input
                label="Telefone"
                value={telefone}
                onChange={setTelefone}
                placeholder="(00) 00000-0000"
                required={false}
              />

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Foto opcional
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none text-slate-700"
                />
              </div>

              {erro && (
                <p className="text-red-500 text-xs text-center font-semibold">
                  {erro}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold px-4 py-2 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-[#E8442A] hover:bg-[#d23920] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
                >
                  {editandoId ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

function Input({
  label,
  value,
  placeholder,
  type = "text",
  required = true,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E8442A] text-slate-800 transition"
        placeholder={placeholder}
      />
    </div>
  );
}
