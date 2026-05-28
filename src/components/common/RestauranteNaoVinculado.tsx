import { useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../../services/session";
import { Button, Card, StatusBadge } from "./ui";

export default function RestauranteNaoVinculado({ retry }: { retry: () => void }) {
  const navigate = useNavigate();
  const sessao = getSession();

  return (
    <Card className="mx-auto max-w-2xl p-8 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-lg font-black text-[#E8442A]">
        BA
      </div>
      <h2 className="mb-3 text-2xl font-black text-slate-900">Restaurante não vinculado</h2>
      <p className="mx-auto mb-3 max-w-lg text-slate-600">
        Seu usuário existe, mas ainda não há um restaurante vinculado a esta conta.
      </p>
      <p className="mx-auto mb-6 max-w-lg text-sm text-slate-500">
        Para usar o painel, cardápio, pedidos e funcionários, é necessário que exista um registro de restaurante associado ao seu usuário no back-end.
      </p>

      {sessao && (
        <div className="mb-7 grid gap-3 rounded-2xl bg-slate-50 p-4 text-left sm:grid-cols-3">
          <Info label="ID" value={String(sessao.id)} />
          <Info label="Email" value={sessao.email} />
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase text-slate-400">Tipo</p>
            <StatusBadge value={sessao.tipo} type="usuario" />
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={() => navigate("/")}>Voltar para Home</Button>
        <Button variant="secondary" onClick={() => { clearSession(); navigate("/login"); }}>Sair da conta</Button>
        <Button onClick={retry}>Tentar novamente</Button>
      </div>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-bold uppercase text-slate-400">{label}</p>
      <p className="truncate text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
