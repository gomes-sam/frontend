import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import { resolveAssetUrl } from "../services/api";
import { getApiErrorMessage } from "../services/error";
import { restaurantService } from "../services/restaurantService";
import type { CategoriaRestaurante, Restaurante } from "../types";

const CATEGORIAS: Array<{ nome: string; valor: CategoriaRestaurante; emoji: string }> = [
  { nome: "Pizzaria", valor: "PIZZARIA", emoji: "🍕" },
  { nome: "Hambúrguer", valor: "HAMBURGUERIA", emoji: "🍔" },
  { nome: "Japonesa", valor: "JAPONESA", emoji: "🍣" },
  { nome: "Brasileira", valor: "BRASILEIRA", emoji: "🍛" },
  { nome: "Italiana", valor: "ITALIANA", emoji: "🍝" },
  { nome: "Mexicana", valor: "MEXICANA", emoji: "🌮" },
  { nome: "Saudável", valor: "SAUDAVEL", emoji: "🥗" },
  { nome: "Doceria", valor: "DOCERIA", emoji: "🍰" },
  { nome: "Outros", valor: "OUTROS", emoji: "+" },
];

export default function HomePublica() {
  const navigate = useNavigate();
  const buscaRef = useRef<HTMLInputElement>(null);
  const buscaRequestRef = useRef(0);

  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [resultados, setResultados] = useState<Restaurante[]>([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [erroBusca, setErroBusca] = useState("");

  useEffect(() => {
    carregarRestaurantes();
  }, []);

  async function carregarRestaurantes() {
    setLoading(true);
    setErro("");

    try {
      const lista = await restaurantService.listar();

      setRestaurantes(lista.filter((r: Restaurante) => r.ativo !== false));
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível carregar os restaurantes."));
      setRestaurantes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleBusca(termo: string) {
    const requestId = ++buscaRequestRef.current;
    setBusca(termo);
    setCategoriaAtiva("");
    setErroBusca("");

    if (termo.trim().length < 2) {
      setResultados([]);
      return;
    }

    try {
      const lista = await restaurantService.buscar(termo.trim());
      if (requestId === buscaRequestRef.current) {
        setResultados(lista);
      }
    } catch (error) {
      if (requestId === buscaRequestRef.current) {
        setErroBusca(getApiErrorMessage(error, "Não foi possível buscar restaurantes."));
        setResultados([]);
      }
    }
  }

  async function handleCategoria(valor: CategoriaRestaurante | "") {
    setCategoriaAtiva(valor);
    setBusca("");
    setResultados([]);
    setErroBusca("");
    setErro("");

    if (!valor) {
      carregarRestaurantes();
      return;
    }

    setLoading(true);

    try {
      const lista = await restaurantService.buscarPorCategoria(valor);
      setRestaurantes(lista);
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível filtrar os restaurantes."));
      setRestaurantes([]);
    } finally {
      setLoading(false);
    }
  }

  function abrirRestaurante(id: number) {
    navigate(`/restaurante/${id}`);
  }

  function formatarPreco(valor?: number) {
    if (valor === undefined || valor === null) {
      return "0,00";
    }

    return Number(valor).toFixed(2).replace(".", ",");
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8">
        <section className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl p-8 md:p-14 mt-8 overflow-hidden border border-orange-100">
          <div className="max-w-2xl">
            <span className="inline-flex bg-white text-[#E8442A] font-bold text-xs px-4 py-2 rounded-full mb-5 shadow-sm">
              🍽️ BoiaAqui
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Fome agora?{" "}
              <span className="text-[#E8442A]">
                A gente boia até você.
              </span>
            </h1>

            <p className="text-slate-500 mt-5 text-base md:text-lg leading-relaxed">
              Encontre restaurantes perto de você, veja o cardápio em tempo real
              e acompanhe seu pedido de forma simples.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => {
                  document
                    .getElementById("busca-restaurante")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setTimeout(() => buscaRef.current?.focus(), 300);
                }}
                className="bg-[#E8442A] hover:bg-[#d13921] transition text-white px-6 py-3 rounded-xl font-bold shadow-sm"
              >
                Buscar restaurantes
              </button>

              <button
                onClick={() => navigate("/cadastro")}
                className="bg-white hover:bg-orange-50 transition text-[#E8442A] px-6 py-3 rounded-xl font-bold border border-orange-100"
              >
                Criar conta
              </button>
            </div>
          </div>
        </section>

        <section id="busca-restaurante" className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Restaurantes
              </h2>
              <p className="text-sm text-slate-500">
                Busque pelo nome ou explore por categoria.
              </p>
            </div>

            <div className="relative w-full md:max-w-md">
              <input
                ref={buscaRef}
                type="text"
                placeholder="Buscar restaurante..."
                value={busca}
                onChange={(e) => handleBusca(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-[#E8442A] shadow-sm"
              />

              {resultados.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-100">
                  {resultados.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => abrirRestaurante(r.id)}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 transition border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-bold text-slate-800">
                        🍽️ {r.nomeFantasia}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {r.categoria ?? "Outros"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {erroBusca && (
                <p className="mt-2 text-xs text-red-600 font-semibold">{erroBusca}</p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoria("")}
              className={`px-5 py-2 rounded-full border transition font-semibold ${
                categoriaAtiva === ""
                  ? "bg-[#E8442A] text-white border-[#E8442A]"
                  : "bg-white border-gray-200 text-slate-700 hover:border-[#E8442A]"
              }`}
            >
              Todos
            </button>

            {CATEGORIAS.map((cat) => (
              <button
                key={cat.valor}
                onClick={() => handleCategoria(cat.valor)}
                className={`px-5 py-2 rounded-full border transition flex items-center gap-2 font-semibold ${
                  categoriaAtiva === cat.valor
                    ? "bg-[#E8442A] text-white border-[#E8442A]"
                    : "bg-white border-gray-200 text-slate-700 hover:border-[#E8442A]"
                }`}
              >
                {cat.emoji} {cat.nome}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              Abertos agora
            </h2>

            <button
              onClick={carregarRestaurantes}
              className="text-sm font-bold text-[#E8442A] hover:underline"
            >
              Atualizar
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-gray-100">
              Carregando restaurantes...
            </div>
          ) : erro ? (
            <div className="bg-red-50 rounded-3xl p-10 text-center text-red-600 border border-red-100">
              {erro}
            </div>
          ) : restaurantes.length === 0 ? (
            <div className="bg-orange-100 rounded-3xl p-10 text-center text-slate-500">
              Nenhum restaurante encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurantes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => abrirRestaurante(r.id)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-52 bg-orange-100 flex items-center justify-center text-6xl">
                    {r.fotoCapa ? (
                      <img
                        src={resolveAssetUrl(r.fotoCapa)}
                        alt={r.nomeFantasia}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "🍽️"
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-slate-900">
                        {r.nomeFantasia}
                      </h3>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          r.aberto === false
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {r.aberto === false ? "Fechado" : "Aberto"}
                      </span>
                    </div>

                    <p className="text-slate-500 text-sm mt-1">
                      {r.categoria ?? "Outros"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-4">
                      <span>⏱ {r.tempoPedidoMin ?? 40} min</span>
                      <span>🛵 R$ {formatarPreco(r.taxaEntrega)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
