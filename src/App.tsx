import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePublica from "./pages/HomePublica";
import AcessoNegado from "./pages/AcessoNegado";
import Ajuda from "./pages/Ajuda";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import HomeAdmin from "./pages/admin/HomeAdmin";
import GerenciarClientes from "./pages/admin/GerenciarClientes";
import GerenciarRestaurantes from "./pages/admin/GerenciarRestaurantes";
import Funcionarios from "./pages/admin/Funcionarios";
import Cadastro from "./pages/auth/Cadastro";
import Login from "./pages/auth/Login";
import Checkout from "./pages/client/Checkout";
import MeusPedidos from "./pages/client/MeusPedidos";
import MeuPerfil from "./pages/client/MeuPerfil";
import SucessoPedido from "./pages/client/SucessoPedido";
import AcompanharPedido from "./pages/restaurant/AcompanharPedido";
import Cardapio from "./pages/restaurant/Cardapio";
import DashboardRestaurante from "./pages/restaurant/DashboardRestaurante";
import DetalhePedidoRestaurante from "./pages/restaurant/DetalhePedidoRestaurante";
import DetalheRestaurante from "./pages/restaurant/DetalheRestaurante";
import MeuRestaurante from "./pages/restaurant/MeuRestaurante";
import PainelRestaurante from "./pages/restaurant/PainelRestaurante";
import { getSession } from "./services/session";

function requireRole(children: ReactElement, allowed: string[]) {
  const sessao = getSession();
  if (!sessao) return <Navigate to="/login" replace />;
  return allowed.includes(sessao.tipo) ? children : <Navigate to="/acesso-negado" replace />;
}

const RotaCliente = ({ children }: { children: ReactElement }) =>
  requireRole(children, ["CLIENTE"]);
const RotaRestaurante = ({ children }: { children: ReactElement }) =>
  requireRole(children, ["RESTAURANTE", "FUNCIONARIO"]);
const RotaAdmin = ({ children }: { children: ReactElement }) =>
  requireRole(children, ["ADMIN"]);
const RotaAutenticada = ({ children }: { children: ReactElement }) =>
  requireRole(children, ["CLIENTE", "RESTAURANTE", "FUNCIONARIO", "ADMIN"]);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePublica />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/restaurante/:id" element={<DetalheRestaurante />} />
      <Route element={<MainLayout />}>
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="/acesso-negado" element={<AcessoNegado />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/meu-perfil" element={<RotaAutenticada><MeuPerfil /></RotaAutenticada>} />
        <Route path="/meus-pedidos" element={<RotaCliente><MeusPedidos /></RotaCliente>} />
        <Route path="/pedido/:id" element={<RotaCliente><AcompanharPedido /></RotaCliente>} />
        <Route path="/checkout" element={<RotaCliente><Checkout /></RotaCliente>} />
        <Route path="/pedido/sucesso" element={<RotaCliente><SucessoPedido /></RotaCliente>} />
        <Route path="/restaurante/painel" element={<RotaRestaurante><PainelRestaurante /></RotaRestaurante>} />
        <Route path="/restaurante/dashboard" element={<RotaRestaurante><DashboardRestaurante /></RotaRestaurante>} />
        <Route path="/restaurante/meu-restaurante" element={<RotaRestaurante><MeuRestaurante /></RotaRestaurante>} />
        <Route path="/restaurante/cardapio" element={<RotaRestaurante><Cardapio /></RotaRestaurante>} />
        <Route path="/restaurante/funcionarios" element={<RotaRestaurante><Funcionarios /></RotaRestaurante>} />
        <Route path="/restaurante/pedidos/:id" element={<RotaRestaurante><DetalhePedidoRestaurante /></RotaRestaurante>} />
        <Route path="/admin/home" element={<RotaAdmin><HomeAdmin /></RotaAdmin>} />
        <Route path="/admin/restaurantes" element={<RotaAdmin><GerenciarRestaurantes /></RotaAdmin>} />
        <Route path="/admin/clientes" element={<RotaAdmin><GerenciarClientes /></RotaAdmin>} />
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/homeadmin" element={<Navigate to="/admin/home" replace />} />
      <Route path="/clientes" element={<Navigate to="/admin/clientes" replace />} />
      <Route path="/admin/funcionarios" element={<Navigate to="/admin/clientes" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
