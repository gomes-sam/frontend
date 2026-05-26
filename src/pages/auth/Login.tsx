import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { saveSession } from "../../services/api";
import loginDog from "../../assets/login-dog.png";
import BotaoVoltar from "../../components/common/BotaoVoltar";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const gerenciarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    const payload = { email, senha };
    console.log("Login body enviado:", payload);

    try {
      const auth = await authService.login(payload);
      console.log("Login resposta recebida:", auth);

      saveSession(auth);
      console.log("Token salvo:", auth.token);
      console.log("Role salva:", auth.tipo);

      if (auth.tipo === "ADMIN") {
        navigate("/admin/home");
      } else if (auth.tipo === "RESTAURANTE" || auth.tipo === "FUNCIONARIO") {
        navigate("/restaurante/painel");
      } else {
        navigate("/");
      }
    } catch (error: unknown) {
      console.error("Erro ao autenticar:", error);
      const err = error as {
        response?: { data?: unknown; status?: number };
        data?: unknown;
      };
      const responseData = err.response?.data ?? err.data;
      let mensagem = "Não foi possível conectar ao servidor.";

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

      if (err.response?.status === 401 || err.response?.status === 403) {
        mensagem = "E-mail ou senha incorretos.";
      }

      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] font-sans flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[550px]">
        <div className="p-10 flex flex-col justify-center">
          <BotaoVoltar className="self-start mb-4" />
          <div className="flex items-center gap-2 mb-8 select-none">
            <div className="bg-[#E8442A] text-white p-2 rounded-xl flex items-center justify-center font-bold text-base w-8 h-8 shadow-sm">
              🍽️
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight">
              Boia <span className="text-[#E8442A]">Aqui</span>
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Bem-vindo de volta!
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Insira suas credenciais para acessar sua conta.
            </p>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-4">
              ⚠️ {erro}
            </div>
          )}

          <form onSubmit={gerenciarLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200/80 focus:border-[#E8442A] focus:bg-white outline-none rounded-xl px-4 py-3 text-sm text-slate-800 transition shadow-inner placeholder-slate-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Senha
                </label>
              </div>

              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200/80 focus:border-[#E8442A] focus:bg-white outline-none rounded-xl px-4 py-3 text-sm text-slate-800 transition shadow-inner placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8442A] hover:bg-[#d13921] disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-sm mt-2"
            >
              {loading ? "Autenticando..." : "Entrar na Conta"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-medium mt-6">
            Não possui uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="text-[#E8442A] font-bold hover:underline"
            >
              Cadastre-se aqui
            </button>
          </p>
        </div>

        <div className="hidden md:flex bg-[#FFF5F2] items-center justify-center p-8 border-l border-gray-50">
          <div className="max-w-xs text-center flex flex-col items-center">
            <img
              src={loginDog}
              alt="Ilustração BoiaAqui"
              className="w-56 h-auto drop-shadow-md object-contain mb-6"
            />
            <h2 className="text-base font-black text-slate-800 tracking-tight">
              Sua refeição a um clique
            </h2>
            <p className="text-slate-400 text-xs font-medium mt-1">
              Conectando você aos melhores estabelecimentos da sua região.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
