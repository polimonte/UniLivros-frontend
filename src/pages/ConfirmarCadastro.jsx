import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function ConfirmarCadastro() {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!codigo) {
      toast.error("Por favor, insira o código de confirmação.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codigo }),
      });

      if (response.ok) {
        navigate("/login", {
          state: {
            message: "Cadastro confirmado com sucesso! Faça seu login.",
          },
        });
      } else {
        toast.error("Código inválido ou expirado.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
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
            <button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? "Validando..." : "Confirmar Cadastro"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
