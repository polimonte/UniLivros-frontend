import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div>
        <div className="sidebar-header">
          <button onClick={onClose} className="sidebar-close-btn">
            &#8249;
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className="sidebar-link active"
            onClick={onClose}
          >
            <span className="sidebar-link-icon">&#8962;</span>
            <span className="sidebar-link-text">Página Inicial</span>
          </Link>
          <Link to="/notificacoes" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-link-icon">&#128276;</span>
            <span className="sidebar-link-text">Notificações</span>
          </Link>
          <Link to="#" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-link-icon add-icon">+</span>
            <span className="sidebar-link-text">Adicionar Livro</span>
          </Link>
          <Link
            to="/perfil/jonatas-lopes"
            className="sidebar-link"
            onClick={onClose}
          >
            <span className="sidebar-link-icon">&#128100;</span>
            <span className="sidebar-link-text">Meu Perfil</span>
          </Link>
          <Link to="#" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-link-icon">&#9881;</span>
            <span className="sidebar-link-text">Configurações</span>
          </Link>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </aside>
  );
}
