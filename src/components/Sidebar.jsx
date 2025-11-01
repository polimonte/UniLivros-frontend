import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <button onClick={onClose} className="sidebar-close-btn">
          &#8249;
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className="sidebar-link active" onClick={onClose}>
          <span className="sidebar-link-icon">&#8962;</span>
          <span className="sidebar-link-text">Página Inicial</span>
        </Link>
        <Link to="#" className="sidebar-link" onClick={onClose}>
          <span className="sidebar-link-icon">&#128276;</span>
          <span className="sidebar-link-text">Notificações</span>
        </Link>
        <Link to="#" className="sidebar-link" onClick={onClose}>
          <span className="sidebar-link-icon">&#128269;</span>
          <span className="sidebar-link-text">Pesquisar</span>
        </Link>
        <Link to="#" className="sidebar-link" onClick={onClose}>
          <span className="sidebar-link-icon add-icon">+</span>
          <span className="sidebar-link-text">Adicionar Livro</span>
        </Link>
        <Link to="#" className="sidebar-link" onClick={onClose}>
          <span className="sidebar-link-icon">&#9881;</span>
          <span className="sidebar-link-text">Configurações</span>
        </Link>
      </nav>
    </aside>
  );
}
