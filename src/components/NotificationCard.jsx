import React from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaCheckCircle } from "react-icons/fa";
import "./NotificationCard.css";

export default function NotificationCard({
  title,
  text,
  buttonText,
  buttonLink,
  isRead,
  createdAt,
  onMarkAsRead,
  onDelete,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;

    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className={`notification-card ${!isRead ? "unread" : ""}`}>
      <div className="notification-header">
        <h3 className="notification-title">{title}</h3>
        <div className="notification-actions">
          {!isRead && (
            <button
              className="notification-icon-btn"
              onClick={onMarkAsRead}
              title="Marcar como lida"
            >
              <FaCheckCircle />
            </button>
          )}
          <button
            className="notification-icon-btn delete"
            onClick={onDelete}
            title="Remover"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <p className="notification-text">{text}</p>

      <div className="notification-footer">
        <span className="notification-time">{formatDate(createdAt)}</span>
        <Link to={buttonLink} className="notification-btn">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
