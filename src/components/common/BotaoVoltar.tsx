import { useNavigate } from "react-router-dom";

interface BotaoVoltarProps {
  className?: string;
}

export default function BotaoVoltar({ className = "" }: BotaoVoltarProps) {
  const navigate = useNavigate();

  function voltar() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  }

  return (
    <button
      type="button"
      onClick={voltar}
      className={`text-sm font-bold text-[#E8442A] hover:underline hover:bg-orange-50 rounded-lg px-2 py-1 transition ${className}`}
    >
      &larr; Voltar
    </button>
  );
}
