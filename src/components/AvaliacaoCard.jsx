import React from "react";
import "./AvaliacaoCard.css";

export default function AvaliacaoCard({ title, text }) {
  return (
    <div className="avaliacao-card">
      <div className="avaliacao-icon">&#128100;</div>
      <div className="avaliacao-content">
        <h4 className="avaliacao-title">{title}</h4>
        <p className="avaliacao-text">{text}</p>
      </div>
    </div>
  );
}
