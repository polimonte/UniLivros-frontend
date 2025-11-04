import React from "react";
import { Link } from "react-router-dom";
import "./DashboardHeader.css";

export default function DashboardHeader({ onMenuClick }) {
  return (
    <header className="dash-header">
      <div className="dash-header-top">
        <div className="dash-header-left">
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
          <button className="dash-icon-btn profile-btn" onClick={onMenuClick}>
            &#128100;
          </button>
        </nav>
      </div>

      <div className="dash-nav-links">
        <Link to="#">Minha Estante</Link>
        <Link to="/minhas-trocas">Minhas Trocas</Link>
        <Link to="#">Minhas Propostas</Link>
        <Link to="#">Sobre</Link>
      </div>
    </header>
  );
}
