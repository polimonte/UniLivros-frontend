import React, { useState } from "react";
import "./PerfilHeader.css";

export default function PerfilHeader({ user, activeTab, setActiveTab }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <section className="perfil-header-card">
      <div className="perfil-info-main">
        <img src={user.avatar} alt={user.name} className="perfil-avatar" />
        <div className="perfil-info-text">
          <h1 className="perfil-name">{user.name}</h1>
          <div className="perfil-stats">
            <span className="stat-item">&#9733; {user.rating}</span>
            <span className="stat-item">{user.tradeCount} Livros Trocados</span>
            <span className="stat-item">{user.followerCount} Seguidores</span>
          </div>
        </div>
        <div className="perfil-info-actions">
          <button
            className={`perfil-btn-seguir ${isFollowing ? "seguindo" : ""}`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>
          <button className="perfil-btn-icon">&#128172;</button>
        </div>
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
