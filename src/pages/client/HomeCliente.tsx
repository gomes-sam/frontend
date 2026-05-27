import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { resolveAssetUrl } from "../../services/api";
import { restaurantService } from "../../services/restaurantService";
import { clearSession } from "../../services/session";
import type { Restaurante } from "../../types";

const fmt = (v: number | undefined) => {
  const num = Number(v);
  if (isNaN(num) || num === 0) return "Grátis";
  return `R$ ${num.toFixed(2).replace(".", ",")}`;
};

export default function HomeCliente() {
  const navigate = useNavigate();
  const inputBuscaRef = useRef<HTMLInputElement>(null);
  
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

  const categorias = [
    "Todas", "Pizzaria", "Hamburgueria", "Japonesa", 
    "Brasileira", "Italiana", "Mexicana", "Saudavel", "Doceria", "Outros"
  ];

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const lista = await restaurantService.listar();
        setRestaurantes(lista);
      } catch (err) {
        console.error("Erro ao carregar restaurantes:", err);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  // Filtragem dinâmica por Nome, Categoria ou Cidade
  const restaurantesFiltrados = restaurantes.filter((r) => {
    const correspondeTexto = 
      r.nomeFantasia.toLowerCase().includes(busca.toLowerCase()) ||
      r.categoria.toLowerCase().includes(busca.toLowerCase()) ||
      (r.cidade && r.cidade.toLowerCase().includes(busca.toLowerCase()));
      
    const correspondeCategoria = 
      categoriaAtiva === "Todas" || 
      r.categoria.toLowerCase() === categoriaAtiva.toLowerCase();

    return correspondeTexto && correspondeCategoria;
  });

  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] font-sans flex flex-col justify-between">
      
      <div>
        {/* NAVBAR */}
        <header className="w-full bg-white border-b border-gray-100 px-12 py-4 flex items-center justify-between shadow-sm">
          <div onClick={() => navigate("/home")} className="flex items-center gap-2 cursor-pointer select-none">
            <div className="bg-[#E8442A] text-white p-2 rounded-xl flex items-center justify-center font-bold text-lg w-9 h-9 shadow-sm">
              🍽️
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              Boia <span className="text-[#E8442A]">Aqui</span>
            </span>
          </div>

          <nav className="flex items-center gap-8">
            <button className="font-semibold text-sm text-slate-900 border-b-2 border-slate-900 pb-0.5">
              Restaurantes
            </button>
            
            <button 
              onClick={() => { 
                setBusca(""); 
                setCategoriaAtiva("Todas"); 
                setTimeout(() => {
                  inputBuscaRef.current?.focus();
                  inputBuscaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
              }} 
              className="font-semibold text-sm text-slate-600 hover:text-[#E8442A] transition"
            >
              Buscar
            </button>
            
            <button 
              onClick={() => navigate("/meus-pedidos")} 
              className="font-semibold text-sm text-slate-600 hover:text-[#E8442A] transition"
            >
              Meus pedidos
            </button>
          </nav>

          <div>
            <button 
              onClick={() => { clearSession(); navigate("/"); }} 
              className="text-slate-700 hover:text-[#E8442A] font-bold text-xs transition"
            >
              Sair
            </button>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="max-w-7xl mx-auto w-full px-12 py-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-5">Buscar</h1>

          {/* INPUT DE BUSCA */}
          <div className="relative w-full mb-6">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">🔍</span>
            <input
              ref={inputBuscaRef}
              type="text"
              placeholder="Nome do restaurante ou cidade"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-white pl-11 pr-4 py-3.5 rounded-xl border border-[#E8442A]/30 focus:border-[#E8442A] outline-none text-slate-800 placeholder-slate-400 shadow-sm text-sm"
            />
          </div>

          {/* BOTÕES DE CATEGORIAS */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categorias.map((cat) => {
              const itemAtivo = categoriaAtiva === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaAtiva(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    itemAtivo
                      ? "bg-[#E8442A] text-white border-[#E8442A] shadow-sm"
                      : "bg-white text-slate-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* INTERFACE DOS CARDS */}
          {loading ? (
            <p className="text-slate-500 text-center py-12 font-medium">Buscando estabelecimentos...</p>
          ) : restaurantesFiltrados.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-sm mx-auto mt-4">
              <span className="text-3xl">🫙</span>
              <h3 className="text-slate-800 font-bold mt-2">Nenhum resultado</h3>
              <p className="text-slate-400 text-xs mt-1">Não encontramos restaurantes para os critérios informados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurantesFiltrados.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/restaurante/${r.id}`)}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="w-full h-44 bg-[#F5ECDC] flex items-center justify-center overflow-hidden">
                    {r.fotoCapa ? (
                      <img src={resolveAssetUrl(r.fotoCapa)} alt={r.nomeFantasia} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <span className="text-3xl opacity-20 group-hover:scale-110 transition duration-300">🍲</span>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-slate-900 font-extrabold text-base truncate group-hover:text-[#E8442A] transition-colors">{r.nomeFantasia}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${r.aberto ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {r.aberto ? "Aberto" : "Fechado"}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-xs font-medium mb-4">{r.categoria}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-2 border-t border-gray-50">
                      <span>🕒 {r.tempoPedidoMin || 40} min</span>
                      <span>🚲 {fmt(r.taxaEntrega)}</span>
                    </div>
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
