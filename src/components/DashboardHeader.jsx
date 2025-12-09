import React, { useState, useEffect } from "react"; // ⬅️ Adicione 'useEffect' aqui
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./DashboardHeader.css";

import { API_BASE_URL } from "../services/api";

export default function DashboardHeader({ onMenuClick, onAddBookClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false); // ⬅️ NOVO ESTADO
  const navigate = useNavigate();

  // Função para buscar o status das notificações
  const fetchNotificationStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // ✅ Endpoint de exemplo: você precisará implementar um no backend
      // que retorne se há notificações não lidas para o usuário.
      // Vou usar um nome de endpoint provisório: /notificacoes/nao-lidas/status
      const response = await fetch(
        `${API_BASE_URL}/notificacoes/nao-lidas/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        // Supondo que a API retorne um objeto { hasUnread: boolean }
        const data = await response.json();
        setHasUnreadNotifications(data.hasUnread);
      }
    } catch (error) {
      console.error("Erro ao verificar notificações:", error);
      // O erro não deve bloquear a renderização do header
    }
  };

  useEffect(() => {
    fetchNotificationStatus();

    // Opcional: Atualizar a cada 60 segundos
    const intervalId = setInterval(fetchNotificationStatus, 60000);

    // Limpeza ao desmontar o componente
    return () => clearInterval(intervalId);
  }, []);

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
          {/* ⬅️ NOVO: Adicionar uma classe de contêiner para posicionamento */}
          <div className="notification-wrapper">
            <button
              className="dash-icon-btn profile-btn"
              onClick={onMenuClick}
              title="Menu / Perfil"
            >
              &#128100;
            </button>
            {/* ⬅️ NOVO: Renderizar a bolinha (badge) se houver notificações */}
            {hasUnreadNotifications && (
              <div className="notification-badge"></div>
            )}
          </div>
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
