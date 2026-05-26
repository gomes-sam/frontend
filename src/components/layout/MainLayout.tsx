import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  // Deixamos o fluxo passar para renderizar a Navbar e o conteúdo do Outlet
  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] flex flex-col">
      {/* Navbar Fixa no Topo */}
      <Navbar />

      {/* Conteúdo Dinâmico das Páginas */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}