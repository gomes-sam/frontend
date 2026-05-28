import { useNavigate } from "react-router-dom";

export default function AcessoNegado() {
  const navigate = useNavigate();
  return <div className="max-w-lg mx-auto mt-12 bg-white rounded-3xl border border-gray-100 p-10 text-center"><h1 className="text-2xl font-black mb-3">Acesso negado</h1><p className="text-slate-500 mb-6">Seu perfil nao possui permissao para acessar esta pagina.</p><button onClick={() => navigate("/")} className="bg-[#E8442A] text-white px-6 py-3 rounded-xl font-bold">Voltar para Home</button></div>;
}
