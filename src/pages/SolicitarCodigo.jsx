import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function SolicitarCodigo() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      alert("Por favor, preencha seu e-mail.");
      return;
    }

    console.log("--- Solicitação de Código ---");
    console.log("E-mail:", email);
    alert("Código enviado (simulado)! Redirecionando...");

    navigate("/confirmar-codigo");
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <p className="form-info-text">
            Digite seu e-mail para enviarmos um código de recuperação.
          </p>

          <form className="form-form" onSubmit={handleSubmit}>
            <div className="email-row">
              <input
                type="text"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>
            <button type="submit" className="form-btn">
              Enviar Código
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
