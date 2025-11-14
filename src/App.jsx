import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import SolicitarCodigo from "./pages/SolicitarCodigo";
import ConfirmarCodigo from "./pages/ConfirmarCodigo";
import ConfirmarCadastro from "./pages/ConfirmarCadastro";
import NovaSenha from "./pages/NovaSenha";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import LivroDetalhes from "./pages/LivroDetalhes";
import MinhasTrocas from "./pages/MinhasTrocas";
import Perfil from "./pages/Perfil";
import MinhaEstante from "./pages/MinhaEstante";
import Sobre from "./pages/Sobre";
import Notificacoes from "./pages/Notificacoes";
import MinhasPropostas from "./pages/MinhasPropostas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueceu-senha" element={<SolicitarCodigo />} />
        <Route path="/confirmar-codigo" element={<ConfirmarCodigo />} />
        <Route path="/confirmar-cadastro" element={<ConfirmarCadastro />} />
        <Route path="/nova-senha" element={<NovaSenha />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/livro/:id" element={<LivroDetalhes />} />
          <Route path="/minhas-trocas" element={<MinhasTrocas />} />
          <Route path="/perfil/:id" element={<Perfil />} />
          <Route path="/minha-estante" element={<MinhaEstante />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/minhas-propostas" element={<MinhasPropostas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
