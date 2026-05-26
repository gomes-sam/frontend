import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePublica from "./pages/HomePublica";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePublica />} />
        <Route path="*" element={<div>404 - Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
