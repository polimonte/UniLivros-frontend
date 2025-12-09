import React from "react";
import "./TradeCard.css";
import placeholderImage from "../assets/sem-capa-placeholder.jpg";

export default function TradeCard({ trade, onClick }) {
  if (!trade) {
    return null;
  }

  const status = trade.status || "PENDENTE";
  const statusText =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <div className="trade-card" onClick={onClick}>
      <div className="trade-book">
        <img
          src={trade.livroRecebido?.img || placeholderImage}
          alt={trade.livroRecebido?.title || "Livro"}
          onError={(e) => {
            e.target.src = placeholderImage;
            e.currentTarget.onerror = null;
          }}
        />
        <span>{trade.livroRecebido?.title || "Título não disponível"}</span>
      </div>

      <span className="trade-icon">&#8644;</span>

      <div className="trade-book">
        <img
          src={trade.livroDado?.img || placeholderImage}
          alt={trade.livroDado?.title || "Livro"}
          onError={(e) => {
            e.target.src = placeholderImage;
            e.currentTarget.onerror = null;
          }}
        />
        <span>{trade.livroDado?.title || "Título não disponível"}</span>
      </div>

      <div className="trade-status-wrapper">
        <span className={`trade-status ${status.toLowerCase()}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}
