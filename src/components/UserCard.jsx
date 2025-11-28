import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserCard.css";

export default function UserCard({
  id,
  name,
  rating,
  tradeCount,
  avatarImg,
  isCurrentUser = false,
  onTradeClick,
}) {
  const navigate = useNavigate();

  const handleVerEstante = () => {
    navigate(`/perfil/${id}`);
  };

  return (
    <div className="user-card">
      <img src={avatarImg} alt={name} className="user-avatar" />
      <div className="user-info">
        <h4 className="user-name">{name}</h4>
        <div className="user-stats">
          <span className="user-rating">
            &#9733; {rating ? rating.toFixed(1) : "N/A"}
          </span>
          <span className="user-trades">{tradeCount} trocas</span>
        </div>
      </div>
      <div className="user-actions">
        {!isCurrentUser && (
          <>
            <button className="btn-ver-estante" onClick={handleVerEstante}>
              Ver estante
            </button>
            {onTradeClick && (
              <button className="btn-solicitar-card" onClick={onTradeClick}>
                Solicitar
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
