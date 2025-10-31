import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function ConfirmarCodigo() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!codigo) {
      alert("Por favor, insira o código de confirmação.");
      return;
    }
    console.log("--- Código de Confirmação ---");
    console.log("Código:", codigo);
    alert("Código validado (simulado)! Defina sua nova senha.");

    navigate("/nova-senha");
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <p className="form-info-text">
            Enviamos um código de confirmação para o seu e-mail.
          </p>

          <form className="form-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Código de Confirmação"
              className="form-input"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <button type="submit" className="form-btn">
              Confirmar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
