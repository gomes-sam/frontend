import { useNavigate } from "react-router-dom";
import { clearSession } from "../../services/session";

export default function RestauranteNaoVinculado({ retry }: { retry: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-10 text-center max-w-xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 mb-3">Restaurante não vinculado</h2>
      <p className="text-slate-600 mb-6">
        Seu usuário existe, mas ainda não há restaurante vinculado a esta conta.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-sm">Voltar</button>
        <button onClick={() => { clearSession(); navigate("/login"); }} className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm">Sair</button>
        <button onClick={retry} className="px-5 py-2.5 rounded-xl bg-[#E8442A] text-white font-bold text-sm">Tentar novamente</button>
      </div>
    </div>
  );
}
