import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../../services/api";
import { authService } from "../../services/authService";
import type { TipoUsuario } from "../../types";
import dogImg from "../../assets/img.cadastro.png";
import BotaoVoltar from "../../components/common/BotaoVoltar";

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipo: "" as TipoUsuario | "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [senhaFraca, setSenhaFraca] = useState(false);

  const validarSenha = (senha: string) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(senha);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "senha") {
      setSenhaFraca(value.length > 0 && !validarSenha(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const { nome, cpf, telefone, email, senha, confirmarSenha, tipo } = form;

    if (!nome || !cpf || !telefone || !email || !senha || !confirmarSenha || !tipo) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    if (!validarSenha(senha)) {
      setErro("A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas informadas não coincidem.");
      return;
    }

    setLoading(true);

    const payload = {
      nome,
      cpf: cpf.replace(/\D/g, ""),
      telefone: telefone.replace(/\D/g, ""),
      email,
      senha,
      tipo,
    };

    console.log("Cadastro body enviado:", payload);

    try {
      const auth = await authService.register(payload);
      console.log("Cadastro resposta recebida:", auth);

      saveSession(auth);
      console.log("Token salvo:", auth.token);
      console.log("Role salva:", auth.tipo);

      const redirectTo =
        auth.tipo === "ADMIN"
          ? "/admin/home"
          : auth.tipo === "RESTAURANTE"
          ? "/restaurante/painel"
          : "/";

      navigate(redirectTo);
    } catch (error: unknown) {
      console.error("Erro de cadastro recebido:", error);
      const err = error as {
        response?: { data?: unknown; status?: number };
        data?: unknown;
      };
      const responseData = err.response?.data ?? err.data;

      let mensagem = "Erro ao realizar cadastro.";

      if (typeof responseData === "string") {
        mensagem = responseData;
      } else if (Array.isArray(responseData)) {
        mensagem = responseData.join(", ");
      } else if (responseData && typeof responseData === "object") {
        const dataObj = responseData as Record<string, unknown>;

        if (typeof dataObj.message === "string") {
          mensagem = dataObj.message;
        } else if (typeof dataObj.erro === "string") {
          mensagem = dataObj.erro;
        } else if (typeof dataObj.error === "string") {
          mensagem = dataObj.error;
        } else if (typeof dataObj.mensagem === "string") {
          mensagem = dataObj.mensagem;
        } else {
          const values = Object.values(dataObj).filter(
            (value): value is string => typeof value === "string"
          );
          if (values.length > 0) {
            mensagem = values.join(", ");
          }
        }
      }

      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  }

  const senhasOk =
    form.confirmarSenha.length > 0 && form.confirmarSenha === form.senha;

  const senhasNok =
    form.confirmarSenha.length > 0 && form.confirmarSenha !== form.senha;

  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] font-sans flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[650px]">
        <div className="p-10 flex flex-col justify-center md:col-span-7">
          <BotaoVoltar className="self-start mb-4" />
          <div className="flex items-center gap-2 mb-6 select-none">
            <div className="bg-[#E8442A] text-white p-2 rounded-xl flex items-center justify-center font-bold text-base w-8 h-8 shadow-sm">
              🍽️
            </div>

            <span className="text-base font-black text-slate-900 tracking-tight">
              Boia <span className="text-[#E8442A]">Aqui</span>
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Crie sua conta
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Preencha as informações abaixo para se credenciar no sistema.
            </p>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-4">
              ⚠️ {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
              />

              <Input
                label="E-mail"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
              />

              <Input
                label="CPF"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />

              <Input
                label="Telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />

              <div className="flex flex-col">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Senha
                </label>

                <input
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border outline-none rounded-xl px-4 py-2.5 text-sm text-slate-800 transition shadow-inner placeholder-slate-400 ${
                    senhaFraca
                      ? "border-red-400 bg-red-50/30 focus:border-red-400"
                      : "border-gray-200/80 focus:border-[#E8442A] focus:bg-white"
                  }`}
                />

                {senhaFraca && (
                  <span className="text-red-500 font-semibold text-[10px] mt-1 pl-1">
                    Mín. 8 caracteres, 1 maiúscula e 1 número.
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Confirmar Senha
                </label>

                <input
                  type="password"
                  name="confirmarSenha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border outline-none rounded-xl px-4 py-2.5 text-sm text-slate-800 transition shadow-inner placeholder-slate-400 ${
                    senhasNok
                      ? "border-red-400 bg-red-50/30 focus:border-red-400"
                      : senhasOk
                      ? "border-green-400 bg-green-50/30 focus:border-green-400"
                      : "border-gray-200/80 focus:border-[#E8442A] focus:bg-white"
                  }`}
                />

                {senhasNok && (
                  <span className="text-red-500 font-semibold text-[10px] mt-1 pl-1">
                    As senhas não coincidem
                  </span>
                )}

                {senhasOk && (
                  <span className="text-green-600 font-semibold text-[10px] mt-1 pl-1">
                    As senhas coincidem ✓
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Perfil de Acesso
              </label>

              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200/80 focus:border-[#E8442A] focus:bg-white outline-none rounded-xl px-4 py-2.5 text-sm text-slate-800 transition shadow-inner"
              >
                <option value="">Selecione o tipo de perfil</option>
                <option value="CLIENTE">Cliente / Consumidor</option>
                <option value="RESTAURANTE">Dono de Restaurante</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8442A] hover:bg-[#d13921] disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-sm mt-4"
            >
              {loading ? "Processando Cadastro..." : "Concluir Cadastro"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-medium mt-6">
            Já possui uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#E8442A] font-bold hover:underline bg-transparent border-none cursor-pointer"
            >
              Faça Login
            </button>
          </p>
        </div>

        <div className="hidden md:flex md:col-span-5 bg-[#FFF5F2] items-center justify-center p-8 border-l border-gray-50">
          <div className="max-w-xs text-center flex flex-col items-center">
            <img
              src={dogImg}
              alt="Ilustração Cadastro"
              className="w-56 h-auto drop-shadow-md object-contain mb-6"
            />

            <h2 className="text-base font-black text-slate-800 tracking-tight">
              Crie sua conta em instantes
            </h2>

            <p className="text-slate-400 text-xs font-medium mt-1">
              Faça parte da nossa rede de alimentação e gerencie tudo com facilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-gray-200/80 focus:border-[#E8442A] focus:bg-white outline-none rounded-xl px-4 py-2.5 text-sm text-slate-800 transition shadow-inner placeholder-slate-400"
      />
    </div>
  );
}
