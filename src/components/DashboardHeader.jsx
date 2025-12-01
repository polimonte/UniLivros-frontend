import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./DashboardHeader.css";

export default function DashboardHeader({ onMenuClick, onAddBookClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Por favor, digite um termo para pesquisar.");
      return;
    }
    navigate(`/pesquisa?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="dash-header">
      <div className="dash-header-top">
        <div className="dash-header-left">
          <Link to="/dashboard" className="dash-logo-text">
            UniLivros
          </Link>
        </div>

        <form className="dash-search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="O que você está procurando?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-icon">
            &#128269;
          </button>
        </form>

        <nav className="dash-header-right">
          <button
            className="dash-icon-btn add-btn"
            onClick={onAddBookClick}
            title="Adicionar Livro"
          >
            +
          </button>

          <button
            className="dash-icon-btn profile-btn"
            onClick={onMenuClick}
            title="Menu / Perfil"
          >
            &#128100;
          </button>
        </nav>
      </div>

      <div className="dash-nav-links">
        <Link to="/minha-estante">Minha Estante</Link>
        <Link to="/minhas-trocas">Minhas trocas</Link>
        <Link to="/minhas-propostas">Minhas propostas</Link>
        <Link to="/sobre">Sobre</Link>
      </div>
    </header>
  );
}
