import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveAssetUrl } from "../../services/api";
import { getApiErrorMessage, isRestaurantNotLinkedError } from "../../services/error";
import { clearSession } from "../../services/session";
import { productService } from "../../services/productService";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import RestauranteNaoVinculado from "../../components/common/RestauranteNaoVinculado";
import type { MenuItem } from "../../types";

export default function Cardapio() {
  const navigate = useNavigate();

  const [itens, setItens] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagemOperacao, setMensagemOperacao] = useState("");
  const [semRestaurante, setSemRestaurante] = useState(false);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [alterandoId, setAlterandoId] = useState<number | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  async function carregarCardapio() {
    setLoading(true);
    setErro("");
    setSemRestaurante(false);

    try {
      const lista = await productService.listar();
      setItens(lista);
    } catch (error) {
      setItens([]);
      setSemRestaurante(isRestaurantNotLinkedError(error));
      setErro(getApiErrorMessage(error, "Não foi possível carregar o cardápio."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCardapio();
  }, []);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    const precoTexto = preco.trim().replace(/\s/g, "").replace("R$", "");
    const precoNum = Number(
      precoTexto.includes(",")
        ? precoTexto.replace(/\./g, "").replace(",", ".")
        : precoTexto
    );

    if (!nome.trim() || !preco.trim()) {
      setMensagemOperacao("Preencha nome e preço.");
      return;
    }

    if (Number.isNaN(precoNum) || precoNum <= 0) {
      setMensagemOperacao("Informe um preço válido.");
      return;
    }

    setSalvando(true);
    setMensagemOperacao("");

    try {
      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        preco: precoNum,
        categoria: categoria.trim() || undefined,
        foto,
      };

      if (editandoId) {
        await productService.atualizar(editandoId, payload);
      } else {
        await productService.adicionar(payload);
      }

      await carregarCardapio();
      fecharModal();
    } catch (error) {
      tratarErroDeOperacao(error, "Não foi possível salvar o item.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover este item do cardápio?"
    );

    if (!confirmar) return;

    setExcluindoId(id);
    try {
      await productService.deletar(id);
      await carregarCardapio();
    } catch (error) {
      tratarErroDeOperacao(error, "Erro ao excluir item.");
    } finally {
      setExcluindoId(null);
    }
  }

  async function alternarDisponibilidade(id: number) {
    setAlterandoId(id);
    try {
      await productService.alternarDisponibilidade(id);
      await carregarCardapio();
    } catch (error) {
      tratarErroDeOperacao(error, "Erro ao alterar disponibilidade do item.");
    } finally {
      setAlterandoId(null);
    }
  }

  function abrirCadastro() {
    setEditandoId(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setCategoria("");
    setFoto(null);
    setModalAberto(true);
  }

  function abrirEdicao(item: MenuItem) {
    setEditandoId(item.id);
    setNome(item.nome);
    setDescricao(item.descricao ?? "");
    setPreco(String(item.preco).replace(".", ","));
    setCategoria(item.categoria ?? "");
    setFoto(null);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setCategoria("");
    setFoto(null);
  }

  function tratarErroDeOperacao(error: unknown, fallback: string) {
    if (isRestaurantNotLinkedError(error)) {
      setSemRestaurante(true);
      setItens([]);
      fecharModal();
      return;
    }
    setMensagemOperacao(getApiErrorMessage(error, fallback));
  }

  const itensFiltrados = itens.filter((item) => {
    const termo = busca.toLowerCase();
    const nomeItem = typeof item.nome === "string" ? item.nome : "";
    const descricaoItem = typeof item.descricao === "string" ? item.descricao : "";

    return (
      nomeItem.toLowerCase().includes(termo) ||
      descricaoItem.toLowerCase().includes(termo)
    );
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

            <button className="w-full text-left px-4 py-3 text-sm font-semibold bg-[#E8442A]/10 text-[#E8442A] rounded-xl transition">
              🍔 Gerenciar Cardápio
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
            >
              🏠 Home Pública
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
              Gerenciar Cardápio
            </h1>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Controle os pratos, descrições, disponibilidade e valores do seu restaurante.
            </p>
          </div>

          {!semRestaurante && !loading && (
            <button
              onClick={abrirCadastro}
              className="bg-[#E8442A] hover:bg-[#d23920] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm flex items-center gap-2"
            >
              <span>+</span> Adicionar Item
            </button>
          )}
        </div>

        {!semRestaurante && <div className="relative mb-8">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Buscar item no cardápio..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full max-w-md bg-white pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8442A] outline-none text-slate-800 placeholder-slate-400 shadow-sm text-sm transition"
          />
        </div>}

        {mensagemOperacao && !semRestaurante && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {mensagemOperacao}
          </div>
        )}

        {semRestaurante ? (
          <RestauranteNaoVinculado retry={carregarCardapio} />
        ) : loading ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">
              Carregando itens do cardápio...
            </p>
          </div>
        ) : erro ? (
          <div className="bg-red-50 rounded-3xl p-10 text-center border border-red-100 shadow-sm">
            <p className="text-red-600 font-semibold">{erro}</p>
            <button
              onClick={carregarCardapio}
              className="mt-5 bg-[#E8442A] hover:bg-[#d23920] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition"
            >
              Tentar novamente
            </button>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-slate-600 font-bold">
              Nenhum item encontrado.
            </p>

            <button
              onClick={abrirCadastro}
              className="mt-5 bg-[#E8442A] hover:bg-[#d23920] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition"
            >
              Cadastrar primeiro item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itensFiltrados.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between transition hover:shadow-md"
              >
                <div>
                  <div className="w-full h-36 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden mb-4 border border-slate-200/50">
                    {item.foto ? (
                      <img
                        src={resolveAssetUrl(item.foto)}
                        alt={item.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        [ Sem foto ]
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-900 mb-1">
                      {item.nome}
                    </h3>

                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        item.disponivel === false
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {item.disponivel === false ? "Indisponível" : "Disponível"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-normal line-clamp-2 mb-3 h-8">
                    {item.descricao}
                  </p>

                  <p className="text-lg font-black text-slate-900 tracking-tight mb-4">
                    {formatarMoeda(Number(item.preco))}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => abrirEdicao(item)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm text-center"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => alternarDisponibilidade(item.id)}
                    disabled={alterandoId === item.id}
                    className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm text-center"
                  >
                    {alterandoId === item.id ? "Alterando..." : item.disponivel === false ? "Ativar" : "Pausar"}
                  </button>

                  <button
                    onClick={() => handleExcluir(item.id)}
                    disabled={excluindoId === item.id}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm text-center"
                  >
                    {excluindoId === item.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">
              {editandoId
                ? "Editar Item do Cardápio"
                : "Adicionar Item ao Cardápio"}
            </h3>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nome do Prato/Bebida
                </label>

                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E8442A] text-slate-800 transition"
                  placeholder="Ex: X-Burguer Artesanal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Preço R$
                </label>

                <input
                  type="text"
                  required
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E8442A] text-slate-800 transition font-semibold"
                  placeholder="28,90"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Descrição / Ingredientes
                </label>

                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E8442A] text-slate-800 transition resize-none"
                  placeholder="Descreva os componentes do prato..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Categoria
                </label>

                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E8442A] text-slate-800 transition"
                  placeholder="Ex: Lanches, Bebidas, Sobremesas"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Foto opcional
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files?.[0] || null)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E8442A] text-slate-800 transition"
                />
              </div>

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
                  disabled={salvando}
                  className="bg-[#E8442A] hover:bg-[#d23920] disabled:bg-slate-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
                >
                  {salvando
                    ? "Salvando..."
                    : editandoId
                    ? "Atualizar"
                    : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
