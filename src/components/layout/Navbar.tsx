import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalProfile } from "../../services/profileService";
import { consumeFlashMessage } from "../../services/flashMessage";
import { clearSession, getSession, SESSION_UPDATED_EVENT } from "../../services/session";

export default function Navbar() {
  const navigate = useNavigate();
  const [, refresh] = useState(0);
  const [flashMessage, setFlashMessage] = useState(() => consumeFlashMessage());

  useEffect(() => {
    const update = () => refresh((value) => value + 1);
    window.addEventListener(SESSION_UPDATED_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(SESSION_UPDATED_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    if (!flashMessage) return;
    const timeout = window.setTimeout(() => setFlashMessage(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [flashMessage]);

  const sessao = getSession();
  const perfil = getLocalProfile(sessao?.id);
  const nomeUsuario = perfil.nomeExibido || sessao?.nome || "Usuario";
  const tipoUsuario = sessao?.tipo;
  const restaurante = tipoUsuario === "RESTAURANTE" || tipoUsuario === "FUNCIONARIO";

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  return (
    <>
    <nav className="w-full h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between font-sans shadow-sm sticky top-0 z-50">
      <button type="button" className="flex items-center gap-2" onClick={() => navigate("/")}>
        <div className="bg-[#E8442A] text-white p-1.5 rounded-lg text-sm">BA</div>
        <span className="font-black text-slate-900 tracking-tight text-sm">
          Boia <span className="text-[#E8442A]">Aqui</span>
        </span>
      </button>

      <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
        {!sessao && <button onClick={() => navigate("/")} className="hover:text-[#E8442A] transition">Home</button>}
        {tipoUsuario === "CLIENTE" && (
          <>
            <button onClick={() => navigate("/")} className="hover:text-[#E8442A] transition">Home</button>
            <button onClick={() => navigate("/meus-pedidos")} className="hover:text-[#E8442A] transition">Meus Pedidos</button>
            <button onClick={() => navigate("/meu-perfil")} className="hover:text-[#E8442A] transition">Meu Perfil</button>
          </>
        )}
        {restaurante && (
          <>
            <button onClick={() => navigate("/restaurante/painel")} className="hover:text-[#E8442A] transition">Painel Restaurante</button>
            <button onClick={() => navigate("/restaurante/dashboard")} className="hover:text-[#E8442A] transition">Dashboard</button>
            <button onClick={() => navigate("/restaurante/cardapio")} className="hover:text-[#E8442A] transition">Cardapio</button>
            <button onClick={() => navigate("/restaurante/funcionarios")} className="hover:text-[#E8442A] transition">Funcionarios</button>
          </>
        )}
        {tipoUsuario === "ADMIN" && (
          <>
            <button onClick={() => navigate("/admin/home")} className="hover:text-[#E8442A] transition">Painel Admin</button>
            <button onClick={() => navigate("/admin/clientes")} className="hover:text-[#E8442A] transition">Clientes</button>
            <button onClick={() => navigate("/admin/restaurantes")} className="hover:text-[#E8442A] transition">Restaurantes</button>
            <button onClick={() => navigate("/meu-perfil")} className="hover:text-[#E8442A] transition">Meu Perfil</button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {sessao ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{nomeUsuario}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{tipoUsuario}</p>
            </div>
            <button onClick={handleLogout} className="text-xs bg-slate-100 hover:bg-red-50 hover:text-[#E8442A] text-slate-600 font-bold px-3 py-1.5 rounded-lg transition">Sair</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="text-xs text-slate-700 font-bold px-4 py-2 hover:text-[#E8442A] transition">Entrar</button>
            <button onClick={() => navigate("/cadastro")} className="text-xs bg-[#E8442A] hover:bg-[#cf3b22] text-white font-bold px-4 py-2 rounded-lg transition shadow-sm">Criar Conta</button>
          </>
        )}
      </div>
    </nav>
    {flashMessage && (
      <div role="status" className="fixed right-4 top-20 z-[60] max-w-sm rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800 shadow-lg">
        <div className="flex items-start gap-4">
          <span>{flashMessage}</span>
          <button type="button" onClick={() => setFlashMessage(null)} className="text-green-700" aria-label="Fechar mensagem">x</button>
        </div>
      </div>
    )}
    </>
  );
}
