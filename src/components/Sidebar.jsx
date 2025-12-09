import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

import { API_BASE_URL } from "../services/api";

export default function Sidebar({ isOpen, onClose, onAddBookClick }) {
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [userId, setUserId] = useState(null);

  const fetchNotificationStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Não tenta buscar se não houver token

    try {
      const response = await fetch(
        `${API_BASE_URL}/notificacoes/nao-lidas/status`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // A resposta do backend é: { "hasUnread": true/false }
        setHasUnreadNotifications(data.hasUnread);
      } else if (response.status === 401) {
        // Tratar caso de token expirado, se necessário
        console.warn("Token expirado ao verificar notificações.");
      } else {
        console.error("Falha ao buscar status de notificações.");
      }
    } catch (error) {
      console.error("Erro na requisição de notificação:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
      } catch (e) {
        console.error("Erro ao ler usuário", e);
      }
    }
  }, []);

  // 1. Chama a função de verificação quando o componente é montado.
  // 2. Chama a função sempre que o 'isOpen' for alterado para 'true' (o sidebar é aberto)
  useEffect(() => {
    if (isOpen) {
      fetchNotificationStatus();
    }
  }, [isOpen]);

  const handleLogout = () => {
    onClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    onAddBookClick();
    onClose();
  };

  const profileLink = userId ? `/perfil/${userId}` : "/login";

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
            {/* ✅ Badge de Notificação Condicional */}
            {hasUnreadNotifications && (
              <div className="notification-badge"></div>
            )}
          </Link>
          <Link to={profileLink} className="sidebar-link" onClick={onClose}>
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
