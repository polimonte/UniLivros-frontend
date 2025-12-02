import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function ConfirmarCodigo() {
  const [codigo, setCodigo] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!codigo) {
      toast.error("Por favor, insira o código.");
      return;
    }

    if (!email) {
      toast.error("Email não identificado. Reinicie o processo.");
      navigate("/login");
      return;
    }

    // Apenas avança — validação real será feita em /reset-password
    navigate("/nova-senha", { state: { email, code: codigo } });
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <p className="form-info-text">
            Enviamos um código de confirmação para: <strong>{email}</strong>
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
