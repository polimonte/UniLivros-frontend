import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function ConfirmarCadastro() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!codigo) {
      toast.error("Por favor, insira o código de confirmação.");
      return;
    }
    console.log("--- Código de Confirmação de Cadastro ---");
    console.log("Código:", codigo);

    navigate("/login", {
      state: { message: "Cadastro confirmado com sucesso! Faça seu login." },
    });
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <p className="form-info-text">
            Cadastro realizado com sucesso!
            <br />
            Confirme o código enviado para o seu e-mail.
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
              Confirmar Cadastro
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
