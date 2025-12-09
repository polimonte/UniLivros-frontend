import React from "react";
import "./TradeCard.css";
// 🛑 PASSO 1 DA CORREÇÃO: Importe o arquivo de imagem local.
// Certifique-se de que o caminho (ex: '../assets/sem-capa-placeholder.png') está correto.
import placeholderImage from "../assets/sem-capa-placeholder.jpg";

export default function TradeCard({ trade, onClick }) {
  if (!trade) {
    return null;
  }

  const status = trade.status || "PENDENTE";
  const statusText =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  // 🛑 PASSO 2 DA CORREÇÃO: Remova a linha abaixo, pois 'placeholderImage'
  // agora é a imagem importada no topo do arquivo, eliminando a dependência externa.
  // const placeholderImage = "https://placeholder.com/80x120/CCCCCC/666666?text=Sem+Capa";

  return (
    <div className="trade-card" onClick={onClick}>
      <div className="trade-book">
        <img
          // O `placeholderImage` agora se refere ao asset local
          src={trade.livroRecebido?.img || placeholderImage}
          alt={trade.livroRecebido?.title || "Livro"}
          onError={(e) => {
            // e.target.src recebe o asset local, garantindo que não há nova chamada de rede externa
            e.target.src = placeholderImage;
            // Adicionalmente, adicione a linha abaixo para evitar loops de erro caso o asset local também falhe
            e.currentTarget.onerror = null;
          }}
        />
        <span>{trade.livroRecebido?.title || "Título não disponível"}</span>
      </div>

      <span className="trade-icon">&#8644;</span>

      <div className="trade-book">
        <img
          // O `placeholderImage` agora se refere ao asset local
          src={trade.livroDado?.img || placeholderImage}
          alt={trade.livroDado?.title || "Livro"}
          onError={(e) => {
            e.target.src = placeholderImage;
            // Adicionalmente, adicione a linha abaixo para evitar loops de erro
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
