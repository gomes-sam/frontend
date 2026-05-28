import { Link } from "react-router-dom";

export default function NotFound() {
  return <div className="text-center mt-16"><p className="text-[#E8442A] font-black text-5xl">404</p><h1 className="text-2xl font-black mt-3">Pagina nao encontrada</h1><Link to="/" className="inline-block mt-6 bg-[#E8442A] text-white px-6 py-3 rounded-xl font-bold">Ir para Home</Link></div>;
}
