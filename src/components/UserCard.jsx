import React from "react";
import "./UserCard.css";

export default function UserCard({
  name,
  rating,
  tradeCount,
  avatarImg,
  isCurrentUser = false,
}) {
  return (
    <div className="user-card">
      <img src={avatarImg} alt={name} className="user-avatar" />
      <div className="user-info">
        <h4 className="user-name">{name}</h4>
        <div className="user-stats">
          <span className="user-rating">&#9733; {rating}</span>
          <span className="user-trades">{tradeCount} Livros Trocados</span>
        </div>
      </div>
      <div className="user-actions">
        {!isCurrentUser && (
          <button className="btn-ver-estante">Ver estante</button>
        )}
      </div>
    </div>
  );
}
