import { useState } from "react";
import BotaoVoltar from "../../components/common/BotaoVoltar";
import { getLocalProfile, saveLocalProfile, type LocalProfile } from "../../services/profileService";
import { getSession } from "../../services/session";
import { traduzirTipoUsuario } from "../../utils/formatters";

export default function MeuPerfil() {
  const sessao = getSession()!;
  const [form, setForm] = useState<LocalProfile>(() => ({
    usuarioId: sessao.id,
    nomeExibido: sessao.nome,
    tema: "claro",
    ...getLocalProfile(sessao.id),
  }));
  const [salvo, setSalvo] = useState(false);

  function update(field: keyof LocalProfile, value: string) {
    setSalvo(false);
    setForm((current) => ({ ...current, [field]: value }));
  }

  function escolherFoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("fotoPerfil", String(reader.result));
    reader.readAsDataURL(file);
  }

  function salvar(event: React.FormEvent) {
    event.preventDefault();
    saveLocalProfile(form);
    setSalvo(true);
  }

  return (
    <section className="max-w-3xl mx-auto">
      <BotaoVoltar className="mb-5" />
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#E8442A] to-[#d13921] px-8 py-6 text-white">
          <h1 className="text-2xl font-black">Meu Perfil</h1>
          <p className="text-white/80 text-sm mt-1">Dados da sessao e preferencias locais</p>
        </div>
        <form onSubmit={salvar} className="p-8 space-y-5">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-900">

          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <ReadOnly label="E-mail da conta" value={sessao.email} />
            <ReadOnly label="Tipo" value={traduzirTipoUsuario(sessao.tipo)} />
            <ReadOnly label="ID" value={String(sessao.id)} />
            <Input label="Nome exibido" value={form.nomeExibido || ""} onChange={(value) => update("nomeExibido", value)} />
            <Input label="Telefone" value={form.telefone || ""} onChange={(value) => update("telefone", value)} />
            <Input label="CPF" value={form.cpf || ""} onChange={(value) => update("cpf", value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Foto de perfil local</label>
              <input type="file" accept="image/*" onChange={escolherFoto} className="block w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Preferencia visual</label>
              <select value={form.tema} onChange={(event) => update("tema", event.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3">
                <option value="claro">Claro</option>
                <option value="quente">Quente</option>
              </select>
            </div>
          </div>
          {form.fotoPerfil && <img src={form.fotoPerfil} alt="Foto de perfil local" className="h-20 w-20 object-cover rounded-full border border-gray-200" />}
          <div className="flex items-center gap-4">
            <button type="submit" className="bg-[#E8442A] text-white font-bold px-6 py-3 rounded-xl">Salvar localmente</button>
            {salvo && <span className="text-green-700 text-sm font-semibold">Alteracoes salvas neste navegador.</span>}
          </div>
        </form>
      </div>
    </section>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold text-slate-500 uppercase mb-2">{label}</p><div className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3">{value}</div></div>;
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="block text-xs font-bold text-slate-500 uppercase mb-2">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3" /></label>;
}
