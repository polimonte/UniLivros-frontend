import React from "react";
import "./ConquistaCard.css";

export default function ConquistaCard({ iconType, title, text, exp }) {
  const icon = iconType === "confiavel" ? "🤝" : "🧘";

  return (
    <div className="conquista-card">
      <div className="conquista-icon-wrapper">
        <span className="conquista-icon">{icon}</span>
      </div>
      <div className="conquista-content">
        <h4 className="conquista-title">{title}</h4>
        <p className="conquista-text">{text}</p>
      </div>
      <span className="conquista-exp">+{exp} EXP</span>
    </div>
  );
}
