import React from "react";
import "./PerfilHeader.css";

export default function PerfilHeader({ user, activeTab, setActiveTab }) {
  return (
    <section className="perfil-header-card">
      <div className="perfil-info-main">
        <img src={user.avatar} alt={user.name} className="perfil-avatar" />
        <div className="perfil-info-text">
          <h1 className="perfil-name">{user.name}</h1>
          <p className="perfil-curso">{user.curso}</p>
          <div className="perfil-stats">
            <span className="stat-item">
              &#128214; {user.livrosDisponiveis} Livros
            </span>
            <span className="stat-item">
              &#8644; {user.tradeCount} Trocados
            </span>
            <span className="stat-item">
              &#127942; {user.conquistaCount} Conquistas
            </span>
            <span className="stat-item">&#9733; {user.rating}</span>
          </div>
        </div>
        <div className="perfil-info-actions"></div>
      </div>

      <nav className="perfil-nav-tabs">
        <button
          className={`perfil-tab-btn ${
            activeTab === "estante" ? "active" : ""
          }`}
          onClick={() => setActiveTab("estante")}
        >
          &#128214;
        </button>
        <button
          className={`perfil-tab-btn ${
            activeTab === "avaliacoes" ? "active" : ""
          }`}
          onClick={() => setActiveTab("avaliacoes")}
        >
          &#128172;
        </button>
        <button
          className={`perfil-tab-btn ${
            activeTab === "conquistas" ? "active" : ""
          }`}
          onClick={() => setActiveTab("conquistas")}
        >
          &#127942;
        </button>
      </nav>
    </section>
  );
}
