import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearSession } from "../../services/session";
import BotaoVoltar from "../../components/common/BotaoVoltar";

export default function MeuPerfil() {
  const navigate = useNavigate();

  const nome = localStorage.getItem("@BoiaAqui:nomeUsuario") || "";
  const email = localStorage.getItem("@BoiaAqui:emailUsuario") || "";
  const [tipo] = useState(localStorage.getItem("@BoiaAqui:tipoUsuario") || "");

  useEffect(() => {
    if (!nome || !email) {
      navigate("/login");
    }
  }, [nome, email, navigate]);

  const tipoLabel: Record<string, string> = {
    CLIENTE: "Cliente",
    RESTAURANTE: "Restaurante",
    FUNCIONARIO: "Funcionário",
    ADMIN: "Administrador",
  };

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] font-sans">
      <header className="w-full bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="bg-[#E8442A] text-white p-2 rounded-xl flex items-center justify-center font-bold text-lg w-9 h-9 shadow-sm">
            🍽️
          </div>
          <span className="font-black text-slate-900 tracking-tight text-sm">
            Boia <span className="text-[#E8442A]">Aqui</span>
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs bg-slate-100 hover:bg-red-50 hover:text-[#E8442A] text-slate-600 font-bold px-4 py-2 rounded-lg transition"
        >
          Sair
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-6 md:p-10">
        <BotaoVoltar className="mb-5" />
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#E8442A] to-[#d13921] px-8 py-6">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Meu Perfil
            </h1>
            <p className="text-white/80 text-sm font-medium mt-1">
              Informações da sua conta
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Tipo de Usuário */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Tipo de Conta
              </p>
              <p className="text-lg font-bold text-blue-900 mt-1">
                {tipoLabel[tipo as keyof typeof tipoLabel] || tipo}
              </p>
            </div>

            {/* Informações Básicas */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nome Completo
                </label>
                <div className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium">
                  {nome}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  E-mail
                </label>
                <div className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium">
                  {email}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-slate-600 font-medium">
                💡 Para alterar suas informações, entre em contato com o suporte ou acesse suas configurações de segurança.
              </p>
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl text-sm transition"
              >
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
