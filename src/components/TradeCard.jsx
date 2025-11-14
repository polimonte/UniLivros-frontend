import React from "react";
import "./TradeCard.css";

export default function TradeCard({ trade, onClick }) {
  return (
    <div className="trade-card" onClick={onClick}>
      <div className="trade-book">
        <img src={trade.livroRecebido.img} alt={trade.livroRecebido.title} />
        <span>{trade.livroRecebido.title}</span>
      </div>

      <span className="trade-icon">&#8644;</span>

      <div className="trade-book">
        <img src={trade.livroDado.img} alt={trade.livroDado.title} />
        <span>{trade.livroDado.title}</span>
      </div>

      <div className="trade-status-wrapper">
        <span className={`trade-status ${trade.status.toLowerCase()}`}>
          {trade.status}
        </span>
      </div>
    </div>
  );
}
