import React from "react";
import { Link } from "react-router-dom";
import "./DashboardHeader.css";

export default function DashboardHeader({ onMenuClick }) {
  return (
    <header className="dash-header">
      <div className="dash-header-top">
        <div className="dash-header-left">
          <button className="dash-menu-btn" onClick={onMenuClick}>
            &#9776;
          </button>
          <Link to="/dashboard" className="dash-logo-text">
            UniLivros
          </Link>
        </div>

        <div className="dash-search-bar">
          <input type="text" placeholder="O que você está procurando?" />
          <button className="search-icon">&#128269;</button>
        </div>

        <nav className="dash-header-right">
          <button className="dash-icon-btn add-btn">+</button>
          <button className="dash-icon-btn profile-btn">&#128100;</button>
        </nav>
      </div>

      <div className="dash-nav-links">
        <Link to="#">Categorias</Link>
        <Link to="#">Minha Estante</Link>
        <Link to="/minhas-trocas">Minhas trocas</Link>
        <Link to="#">Sobre</Link>
      </div>
    </header>
  );
}
