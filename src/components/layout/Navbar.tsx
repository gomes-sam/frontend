import { useNavigate } from "react-router-dom";
import { clearSession } from "../../services/session";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("@BoiaAqui:token");
  const nomeUsuario = localStorage.getItem("@BoiaAqui:nomeUsuario") || "Usuario";
  const tipoUsuario = localStorage.getItem("@BoiaAqui:tipoUsuario");
  const restaurante = tipoUsuario === "RESTAURANTE" || tipoUsuario === "FUNCIONARIO";

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  function irParaBusca() {
    navigate("/");
    setTimeout(() => {
      document.getElementById("busca-restaurante")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between font-sans shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <div className="bg-[#E8442A] text-white p-1.5 rounded-lg text-sm">🍽️</div>
        <span className="font-black text-slate-900 tracking-tight text-sm">
          Boia <span className="text-[#E8442A]">Aqui</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
        {(!token || tipoUsuario === "CLIENTE") && (
          <>
            <button onClick={() => navigate("/")} className="hover:text-[#E8442A] transition">Restaurantes</button>
            <button onClick={irParaBusca} className="hover:text-[#E8442A] transition">Buscar</button>
          </>
        )}
        {tipoUsuario === "CLIENTE" && (
          <>
            <button onClick={() => navigate("/meus-pedidos")} className="hover:text-[#E8442A] transition">Meus pedidos</button>
            <button onClick={() => navigate("/meu-perfil")} className="hover:text-[#E8442A] transition">Meu perfil</button>
          </>
        )}
        {restaurante && (
          <>
            <button onClick={() => navigate("/restaurante/painel")} className="hover:text-[#E8442A] transition">Painel Restaurante</button>
            <button onClick={() => navigate("/restaurante/cardapio")} className="hover:text-[#E8442A] transition">Cardapio</button>
            <button onClick={() => navigate("/restaurante/funcionarios")} className="hover:text-[#E8442A] transition">Funcionarios</button>
          </>
        )}
        {tipoUsuario === "ADMIN" && (
          <>
            <button onClick={() => navigate("/admin/home")} className="hover:text-[#E8442A] transition">Painel Admin</button>
            <button onClick={() => navigate("/admin/clientes")} className="hover:text-[#E8442A] transition">Clientes</button>
            <button onClick={() => navigate("/admin/restaurantes")} className="hover:text-[#E8442A] transition">Restaurantes</button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {token ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{nomeUsuario}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{tipoUsuario}</p>
            </div>
            <button onClick={handleLogout} className="text-xs bg-slate-100 hover:bg-red-50 hover:text-[#E8442A] text-slate-600 font-bold px-3 py-1.5 rounded-lg transition">Sair</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/login")} className="text-xs text-slate-700 font-bold px-4 py-2 hover:text-[#E8442A] transition">Entrar</button>
            <button onClick={() => navigate("/cadastro")} className="text-xs bg-[#E8442A] hover:bg-[#cf3b22] text-white font-bold px-4 py-2 rounded-lg transition shadow-sm">Criar Conta</button>
          </div>
        )}
      </div>
    </nav>
  );
}
