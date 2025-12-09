import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../components/NotificationCard";
import { API_BASE_URL } from "../services/api";
import "./Notificacoes.css";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Você precisa estar logado");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notificacoes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotificacoes(data);
      } else {
        toast.error("Erro ao carregar notificações");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/notificacoes/${id}/marcar-lida`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setNotificacoes(
        notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/notificacoes/marcar-como-lidas`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Todas as notificações foram marcadas como lidas");
      carregarNotificacoes();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao marcar notificações");
    }
  };

  const deletarNotificacao = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/notificacoes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotificacoes(notificacoes.filter((n) => n.id !== id));
      toast.success("Notificação removida");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao remover notificação");
    }
  };

  const getButtonLink = (notificacao) => {
    if (notificacao.propostaId) {
      return `/minhas-propostas`;
    }
    if (notificacao.trocaId) {
      return `/minhas-trocas`;
    }
    return "#";
  };

  const getButtonText = (tipo) => {
    switch (tipo) {
      case "PROPOSTA_RECEBIDA":
        return "Ver proposta";
      case "PROPOSTA_ACEITA":
      case "PROPOSTA_REJEITADA":
        return "Ver detalhes";
      case "TROCA_CONCLUIDA":
        return "Ver troca";
      default:
        return "Ver mais";
    }
  };

  if (isLoading) {
    return (
      <main className="notificacoes-main">
        <h1 className="notificacoes-title">Notificações</h1>
        <p>Carregando... </p>
      </main>
    );
  }

  return (
    <main className="notificacoes-main">
      <div className="notificacoes-header">
        <h1 className="notificacoes-title">Notificações</h1>
        {notificacoes.some((n) => !n.lida) && (
          <button className="marcar-todas-btn" onClick={marcarTodasComoLidas}>
            Marcar todas como lidas
          </button>
        )}
      </div>

      <h2 className="notificacoes-subtitle">
        Recentes ({notificacoes.length})
      </h2>

      {notificacoes.length === 0 ? (
        <div className="notificacoes-vazio">
          <p>📭 Você não tem notificações no momento.</p>
        </div>
      ) : (
        <div className="notificacoes-list">
          {notificacoes.map((notificacao) => (
            <NotificationCard
              key={notificacao.id}
              title={notificacao.titulo}
              text={notificacao.mensagem}
              buttonText={getButtonText(notificacao.tipo)}
              buttonLink={getButtonLink(notificacao)}
              isRead={notificacao.lida}
              createdAt={notificacao.createdAt}
              onMarkAsRead={() => marcarComoLida(notificacao.id)}
              onDelete={() => deletarNotificacao(notificacao.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
