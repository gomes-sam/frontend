import { type ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";

import HomePublica from "./pages/HomePublica";
import MeusPedidos from "./pages/client/MeusPedidos";
import MeuPerfil from "./pages/client/MeuPerfil";

import HomeAdmin from "./pages/admin/HomeAdmin";
import GerenciarRestaurantes from "./pages/admin/GerenciarRestaurantes";
import GerenciarClientes from "./pages/admin/GerenciarClientes";

import Funcionarios from "./pages/admin/Funcionarios";
import Cardapio from "./pages/restaurant/Cardapio";
import PainelRestaurante from "./pages/restaurant/PainelRestaurante";

import DetalheRestaurante from "./pages/restaurant/DetalheRestaurante";
import AcompanharPedido from "./pages/restaurant/AcompanharPedido";

const RotaAdmin = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem("@BoiaAqui:token");
  const tipo = localStorage.getItem("@BoiaAqui:tipoUsuario");

  if (!token) return <Navigate to="/login" replace />;
  return tipo === "ADMIN" ? children : <Navigate to="/" replace />;
};

const RotaRestaurante = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem("@BoiaAqui:token");
  const tipo = localStorage.getItem("@BoiaAqui:tipoUsuario");

  if (!token) return <Navigate to="/login" replace />;
  return tipo === "RESTAURANTE" || tipo === "FUNCIONARIO" ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

const RotaCliente = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem("@BoiaAqui:token");
  const tipo = localStorage.getItem("@BoiaAqui:tipoUsuario");

  if (!token) return <Navigate to="/login" replace />;
  return tipo === "CLIENTE" ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePublica />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/restaurante/:id" element={<DetalheRestaurante />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/meu-perfil" element={<RotaCliente><MeuPerfil /></RotaCliente>} />
        <Route path="/meus-pedidos" element={<RotaCliente><MeusPedidos /></RotaCliente>} />
        <Route path="/pedido/:id" element={<RotaCliente><AcompanharPedido /></RotaCliente>} />

        <Route
          path="/restaurante/painel"
          element={
            <RotaRestaurante>
              <PainelRestaurante />
            </RotaRestaurante>
          }
        />

        <Route path="/homeadmin" element={<Navigate to="/admin/home" replace />} />
        <Route path="/clientes" element={<Navigate to="/admin/clientes" replace />} />
        <Route path="/admin/funcionarios" element={<Navigate to="/admin/home" replace />} />

        <Route
          path="/restaurante/cardapio"
          element={
            <RotaRestaurante>
              <Cardapio />
            </RotaRestaurante>
          }
        />

        <Route
          path="/restaurante/funcionarios"
          element={
            <RotaRestaurante>
              <Funcionarios />
            </RotaRestaurante>
          }
        />

        <Route
          path="/admin/home"
          element={
            <RotaAdmin>
              <HomeAdmin />
            </RotaAdmin>
          }
        />

        <Route
          path="/admin/restaurantes"
          element={
            <RotaAdmin>
              <GerenciarRestaurantes />
            </RotaAdmin>
          }
        />

        <Route
          path="/admin/clientes"
          element={
            <RotaAdmin>
              <GerenciarClientes />
            </RotaAdmin>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
